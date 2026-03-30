# 4. Implementando Takeoff & Landing

## 1. Introdução

Vimos que as Máquinas de Estados Finitos nos ajudam a modelar comportamentos complexos dividindo-o em partes mais simples.

Vamos modelar um comportamento simples agora.

<aside>
💡

Vamos usar a biblioteca `fsm` para codar um drone que decola e pousa autonomamente.

</aside>

Primeiramente, mude para a branch `implementar`.

```bash
cd ~/drone_ws/src/simple_fsm
git checkout implementar
```

---

## Passo 1: Criando a Classe da FSM

A classe principal da FSM herda de `fsm::FSM`, que é parte do namespace `fsm`. Isso significa que a classe `DroneFSM` tem acesso a todas as funcionalidades da classe base `FSM`. 

### Exemplo:

```cpp
#include "fsm/fsm.hpp"
#include "takeoff_state.hpp"
#include "landing_state.hpp"
#include <rclcpp/rclcpp.hpp>
#include <memory>
#include <iostream>

class TakeoffLandingFSM : public fsm::FSM {
public:
    TakeoffLandingFSM() : fsm::FSM({"ERROR", "FINISHED"}) {

				// CONFIGURAÇÕES INICIAIS
        this->blackboard_set<Drone>("drone", new Drone());
        Drone* drone = blackboard_get<Drone>("drone");

        float takeoff_height = -2.5;
        this->blackboard_set<float>("takeoff_height", takeoff_height);

        // ADICIONANDO ESTADOS
        this->add_state("TAKEOFF", std::make_unique<TakeoffState>());
        this->add_state("LANDING", std::make_unique<LandingState>());

        // ADICIONANDO TRANSIÇÕES
        this->add_transitions("TAKEOFF", {{"TAKEOFF COMPLETED", "LANDING"},{"SEG FAULT", "ERROR"}});

        this->add_transitions("LANDING", {{"LANDED", "FINISHED"},{"SEG FAULT", "ERROR"}});
        
    }
};
```

> Aqui, criamos uma FSM para realizar as operações de decolagem e pouso de um drone. Configuramos o blackboard com dados essenciais como altura de decolagem e orientação inicial. As transições conectam os estados com base em eventos retornados pela função `act` dos estados.
> 

<aside>
🚧

**Sobre a linha:** `this->blackboard_set<Drone>("drone", new Drone());`

O que nós fizemos aqui foi criar um novo objeto da classe Drone (`new Drone()`) e armazenar ele no Blackboard (ou seja, o ponteiro dele).

A **classe Drone** encapsula várias funções que lidam com o PX4 para enviar comandos de movimento, armar o drone, safety warnings, câmeras, etc. Veremos mais sobre ela na próxima aula!

</aside>

---

## Passo 2: Implementando Estados

Cada estado é representado por uma classe que herda de `fsm::State`. Isso significa que os métodos `on_enter`, `act`, e `on_exit` podem ser sobrescritos para implementar comportamentos específicos de cada estado.

### Exemplo: Estado de TakeOff

O estado prepara o drone, configura a altura alvo e o orienta antes de começar a subir.

```cpp
#include <Eigen/Eigen>
#include <opencv2/highgui.hpp>
#include "fsm/fsm.hpp"
#include "drone/Drone.hpp"

class TakeoffState : public fsm::State {
public:
    TakeoffState() : fsm::State() {}

    void on_enter(fsm::Blackboard &blackboard) override {

        drone = blackboard.get<Drone>("drone");
        if (drone == nullptr) return;
        drone->log("STATE: TAKEOFF");

        const Eigen::Vector3d fictual_home(0.0, 0.0, 0.0);
        
        float takeoff_height = *blackboard.get<float>("takeoff_height");
        max_velocity = 0.8;
        
        drone->toOffboardSync();
        drone->armSync();
        drone->setHomePosition(fictual_home);
                
        pos = drone->getLocalPosition();
        initial_yaw = drone->getOrientation()[2];

        goal = Eigen::Vector3d({pos[0], pos[1], takeoff_height});
    }

    std::string act(fsm::Blackboard &blackboard) override {
        (void)blackboard;
        
        pos  = drone->getLocalPosition();

        if ((pos-goal).norm() < 0.15){
            return "TAKEOFF COMPLETED";
        }

				// VAMOS ENVIAR POSICOES PROXIMAS AO DRONE
				// PARA QUE A VELOCIDADE DELE SEJA PEQUENA (MAIS SEGURO)
				Eigen::Vector3d diff = goal - pos;
        Eigen::Vector3d little_goal = pos + (diff.norm() > max_velocity ? diff.normalized() * max_velocity : diff);
        
        drone->setLocalPosition(little_goal[0], little_goal[1], little_goal[2], initial_yaw);
        
        return "";
    }

private:
    float max_velocity;
    Eigen::Vector3d pos, goal, goal_diff, little_goal;
    Drone* drone;
    int print_counter;
    float initial_yaw;
};
```

### Exemplo: Estado de Landing

O estado faz o drone descer gradualmente até atingir o solo e registra a operação no blackboard.

```cpp
#include <Eigen/Eigen>
#include "fsm/fsm.hpp"
#include "drone/Drone.hpp"
#include <chrono>

class LandingState : public fsm::State {
public:
    LandingState() : fsm::State() {}

    void on_enter(fsm::Blackboard &blackboard) override {
        drone = blackboard.get<Drone>("drone");
        if (drone == nullptr) return;
        drone->log("STATE: LANDING");

        pos = drone->getLocalPosition();

        start_time_ = std::chrono::steady_clock::now();

        drone->log("Descending for 8s.");
    }
    std::string act(fsm::Blackboard &blackboard) override {
        (void) blackboard;
        
        auto current_time = std::chrono::steady_clock::now();
        auto elapsed_time = std::chrono::duration_cast<std::chrono::seconds>(current_time - start_time_).count();

        if (elapsed_time > 8) {
            return "LANDED";
        }

        drone->setLocalVelocity(0.0, 0.0, 0.5, 0.0);
        return "";
    }

    void on_exit(fsm::Blackboard &blackboard) override {
        //Publish base coordinates
        (void) blackboard;
        pos = drone->getLocalPosition();

        drone->log("Disarming.");
        drone->disarmSync();
    }

private:
    Drone* drone;
    Eigen::Vector3d pos;
    std::chrono::steady_clock::time_point start_time_;
};
```

---

## Passo 3: Adicionando Transições

As transições são definidas conectando os estados com eventos. Esses eventos são retornados pelos métodos `act` dos estados. Geralmente adicionamos o erro `SEG FAULT` que leva o código a retornar erro.

```cpp
this->add_transitions("CURRENT_STATE", {
    {"EVENT_1", "NEXT_STATE_1"},
    {"EVENT_2", "NEXT_STATE_2"},
    {"EVENT_3", "NEXT_STATE_3"}
});
```

### Exemplo:

```cpp
this->add_transitions("INITIAL TAKEOFF", { {"INITIAL TAKEOFF COMPLETED", "LANDING"}, {"SEG FAULT", "ERROR"} });
this->add_transitions("LANDING", { {"LANDED", "FINISHED"}, {"SEG FAULT", "ERROR"} });
```

> Aqui, a transição do estado de decolagem para o de pouso ocorre quando o evento "INITIAL TAKEOFF COMPLETED" é retornado.
> 

---

## Passo 4: Executando a FSM

Para rodar a FSM, é necessário criar um nó ROS 2 que a execute periodicamente. Isso garante que o método `act` dos estados seja chamado regularmente.

### Exemplo:

```cpp
#include <rclcpp/rclcpp.hpp>
#include "drone/drone_fsm.hpp"

class NodeFSM : public rclcpp::Node {
public:
    NodeFSM() : rclcpp::Node("fsm_node"), my_fsm() {
        timer_ = this->create_wall_timer(
            std::chrono::milliseconds(50),
            std::bind(&NodeFSM::executeFSM, this));
    }

    void executeFSM() {
        if (!my_fsm.is_finished()) {
            my_fsm.execute();
        }
    }

private:
    DroneFSM my_fsm;
    rclcpp::TimerBase::SharedPtr timer_;
};

int main(int argc, char* argv[]) {
    rclcpp::init(argc, argv);
    rclcpp::spin(std::make_shared<NodeFSM>());
    rclcpp::shutdown();
    return 0;
}
```

> O nó ROS 2 NodeFSM roda a FSM continuamente em intervalos regulares. Isso é feito usando um timer que chama o método executeFSM. A integração com o ROS 2 facilita a comunicação entre diferentes nós no sistema, permitindo controlar o drone em tempo real.
> 

---

## Blackboard

O B**lackboard** (”quadro negro”) é um componente usado para compartilhar dados - variáveis, objetos… - entre diferentes estados da FSM.

Ele é composto por:

- **Chave:** é uma string única que identifica o que você está armazenando.
- **Ponteiro:** ponteiro para a variável ou objeto que você está armazenando.

<aside>
🗣️

Setar uma variável no blackboard:

`blackboard.set<TIPO_DA_VARIAVEL>("NOME", VALOR)` 

Obter uma variável:

`blackboard.get<TIPO_DA_VARIAVEL>("NOME")`

</aside>

### Exemplo no Contexto de Decolagem e Pouso

**Configuração no Estado de Takeoff:**

```cpp
blackboard.set<float>("takeoff_height", -2.0);
blackboard.set<float>("initial_yaw", 0.0);
```

**Uso no Estado de Landing:**

```cpp
float initial_yaw = *blackboard.get<float>("initial_yaw");
drone->log("Yaw usado no pouso: " + std::to_string(initial_yaw));
```

---

<aside>
⏭️

Próxima seção da aula:

</aside>

### Próximo: [5. Implementando GoTo](5%20Implementando%20GoTo%201f46e2fe69c48015b451c5320aab94c0.md)