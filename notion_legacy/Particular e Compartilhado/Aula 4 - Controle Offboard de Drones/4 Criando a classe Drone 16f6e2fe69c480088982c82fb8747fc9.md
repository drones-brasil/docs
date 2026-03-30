# 4. Criando a classe Drone

float32[3] acceleration # in meters/second^2

## 1. Overview

Nosso objetivo é criar uma classe, chamada `Drone()`, que seja uma interface para as funções relacionadas ao PX4 e ao ROS 2.

<aside>
⏭️

O que nós queremos é:

1. **Receber informações de Status e de Odometria do drone:**
    1. Subscribers nos tópicos:
        
        `/fmu/out/vehicle_status` 
        
        `/fmu/out/vehicle_odometry`
        
    2. Funções getter:
        
        `drone->getArmingState()`
        
        `drone->getLocalPosition()`
        
        `drone->getOrientation()`
        
2. **Enviar comandos ao drone:**
    1. Publishers nos tópicos:
        
        `/fmu/in/offboard_control_mode`
        
        `/fmu/in/vehicle_command`
        
        `/fmu/in/trajectory_setpoint`
        
    2. Setter para mudar veículo para modo de voo Offboard:
        
        `drone->toOffboardSync()` 
        
    3. Setter para mandar o drone para uma posição:
        
        `drone->setLocalPosition`
        
    4. Setter para armar e desarmar o drone:
        
        `drone->arm`
        
        `drone->disarm`
        
    
</aside>

---

## 2. Drone.hpp vs Drone.cpp

C++ usa um modelo de compilação em que:

- **Header file (.hpp):** contém declarações (o que existe)
    
    > A função existe / a variável existe
    > 
    
    > A variavel existe
    > 
- **Source file (.cpp):** contém implementações (como funciona)
    
    > O que a função faz
    > 
    
    > Qual o valor da variavel
    > 

<aside>
🐒

A ideia é a seguinte:

Quando você importa um arquivo em outro:

```cpp
#include <Drone.hpp>
```

O que isso faz é incluir somente a declaração. Portanto, se lá no `Drone.cpp` você fizer uma alteração em uma função:

```cpp
// No arquivo Drone.cpp

void Drone::arm(){
	// FAZ ALGUMA ALTERAÇÃO AQUI
}
```

Isso não vai causar uma recompilação do arquivo em que ocorre o import. Ou seja, o processo de `build` é mais eficiente.

> Por isso, toda vez que queremos usar uma funcionalidade do `Drone.cpp`, nós importamos o `Drone.hpp` e o linker (uma ferramenta do build) que conecta a chamada da função com a implementação.
> 
</aside>

<aside>
💡

Tudo que é importado no `Drone.hpp` é importado também no `Drone.cpp` ou em outros arquivos que usem `include <Drone.hpp>`.

</aside>

### Diferença entre `<>` e `""`

`#include <header>` - Cabeçalhos do Sistema

- **Onde procura**: Diretórios padrão do sistema e bibliotecas instaladas

`#include "header"` - Cabeçalhos Locais

- **Onde procura**: Primeiro no diretório atual, depois nos diretórios do sistema

```cpp
#include <Eigen/Eigen>       // ← Sistema: /usr/include/eigen3/Eigen/Eigen
#include "fsm/fsm.hpp"       // ← Local: procura em include/fsm/fsm.hpp
#include "drone/Drone.hpp"   // ← Local: procura em include/drone/Drone.hpp
```

**No CMakeLists.txt:**

```makefile
# Isso permite usar "" para encontrar seus headers
include_directories(include)

# Isso permite usar <> para bibliotecas externas
find_package(Eigen3 REQUIRED)
find_package(rclcpp REQUIRED)
```

**Python equivalente:**

```python
import sys                 # Biblioteca padrão
import numpy as np         # Biblioteca externa
from my_module import func # Módulo local
```

---

## 3. Criação do Node

- Clase Drone: herda da classe Node, de ROS 2
- Construtor: inicializa QoS, Publishers e Subscribers

No `Drone.hpp`, vamos criar a classe Drone com o construtor `Drone()`:

```cpp
#ifndef DRONE_HPP_
#define DRONE_HPP_

#include <rclcpp/rclcpp.hpp>

class Drone : public rclcpp::Node
{
public:
	Drone();
	
	// Aqui vamos declarar as funcoes public da classe
	
private:
	// Aqui vamos declarar as variaveis privadas da classe
	// Ex: publishers e subscribers
};

#endif
```

No `Drone.cpp`, vamos definir o que o construtor faz:

```cpp
#include "drone/Drone.hpp"

Drone::Drone() : Node("Drone") {
	
	// Aqui vamos inicializar os publishers e subscribers
	
}

// Aqui vamos definir o que as funções public fazem
// Ex:
// Drone::arm() {}
```

### OBS: Como estão sendo inicializados os Nós?

Na Introdução, nós vimos que a Arquitetura depende de:

| **Classe Drone** | Interface de comunicação | `armSync()`, `getLocalPosition()` |
| --- | --- | --- |
| **FSM** | Lógica de missão | Sequência takeoff → navigate → land |
| **Estados** | Comportamentos específicos | Algoritmo de pouso suave |

Ou seja, a classe Drone é um Nó e a FSM é outro. Na prática, esses dois nós são geridos pelo `MultiThreadedExecutor`, lá na `main` da FSM:

<aside>
⏭️

`MultiThreadedExecutor`: componente do ROS2 responsável por gerenciar e processar callbacks (funções de resposta) de forma paralela. Diferente de um executor single-thread que processa uma tarefa por vez, o multi-threaded pode executar várias operações simultaneamente em threads separadas, melhorando a performance quando há múltiplos subscribers e publishers ativos.

</aside>

 

```cpp
class NodeFSM : public rclcpp::Node {
public:
    NodeFSM(std::shared_ptr<Drone> drone) : rclcpp::Node("goto_node"), drone_node_(drone) {

        fsm_ = std::make_unique<GoToFSM>(drone_node_);

        timer_ = this->create_wall_timer(
            std::chrono::milliseconds(50),  // Run at approximately 20 Hz
            std::bind(&NodeFSM::executeFSM, this));
    }

    void executeFSM() {
        if (rclcpp::ok() && !fsm_->is_finished()) {
            fsm_->execute();
        } else {
            rclcpp::shutdown();
        }
    }

private:
    std::shared_ptr<Drone> drone_node_;
    std::unique_ptr<GoToFSM> fsm_;
    rclcpp::TimerBase::SharedPtr timer_;
};

int main(int argc, const char *argv[]) {
    rclcpp::init(argc, argv);

    rclcpp::executors::MultiThreadedExecutor executor;
    
    auto drone = std::make_shared<Drone>();
    auto fsm_node = std::make_shared<NodeFSM>(drone);
    
    executor.add_node(drone);
    executor.add_node(fsm_node);

    executor.spin();
    
    rclcpp::shutdown();
    return 0;
}
```

```cpp
    rclcpp::executors::MultiThreadedExecutor executor;
    
    auto drone = std::make_shared<Drone>();
    auto fsm_node = std::make_shared<NodeFSM>(drone);
    
    executor.add_node(drone);
    executor.add_node(fsm_node);
```

<aside>
⏭️

1. Cria o nó da Classe Drone
2. Cria e nó da FSM e também passa o nó do Drone como argumento (passamoms o objeto Drone para o Blackboard na FSM para usar nos States!)
3. Adiciona os dois nós ao Executor.
</aside>

```cpp
    executor.spin();
```

<aside>
⏭️

**Execução**: Isso permite que o processamento de mensagens ROS2 aconteça em paralelo, evitando bloqueios na aplicação principal quando mensagens chegam.

</aside>

---

<aside>
⏭️

Próxima seção:

</aside>

### Próximo: [5. Criando Subscribers e Getters](5%20Criando%20Subscribers%20e%20Getters%2016f6e2fe69c480948891fe92426622f4.md)