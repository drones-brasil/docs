# Lab 2 - Classe em C++

## Introdução

Neste laboratório, você desenvolverá um sistema para modelar drones em uma frota. Vamos praticar: Classes, Encapsulamento, Herança, ponteiros inteligentes e praticar o uso de `Eigen::Vector`.

<aside>
😭

!!!! Esse lab é mais difícil que o Lab 1 🥵

Por trás dos panos, Python toma conta de várias coisas para você, enquanto C++ está mais próximo da máquina e tem uma *prose* maior. Isso significa que, embora o Lab seja mais difícil, ele vai te obrigar a entender melhor o que o computador está fazendo 🤖 🤓

</aside>

---

## Instruções

Crie um arquivo como `main.cpp` e utilize o seguinte comando para compilar e executar:

```bash
g++ -std=c++11 -I /usr/include/eigen3 -o main main.cpp && ./main
```

---

## Parte 1: Criando a Classe Drone

### Instrução:

1. Crie uma classe chamada `Drone` que represente um drone genérico.
2. Adicione os seguintes atributos privados:
    - `id_` (inteiro): identificador único do drone.
    - `posicao_` (Eigen::Vector3d): posição atual do drone no espaço tridimensional.
3. Implemente:
    - Um construtor que inicializa o `id_` e a `posicao_`.
    - Getters para o `id_` e a `posicao_`.
    - Setters para a `posicao_`.
4. Adicione um método `exibirDetalhes` que imprime o `id_` e a `posicao_` do drone.

### Exemplo de Uso Esperado:

```cpp
#include <iostream>
#include <Eigen/Eigen>

int main() {
    Drone drone1(1, Eigen::Vector3d(0.0, 0.0, 10.0));
    drone1.exibirDetalhes();
    return 0;
}
```

**Saída esperada:**

```
Drone ID: 1
Posição: [0, 0, 10]
```

---

## Parte 2: Manipulando uma Frota de Drones

### Instrução:

1. Crie uma classe chamada `Frota`.
2. Adicione um atributo privado:
    - `drones_` (std::vector<std::shared_ptr<Drone>>): lista de drones na frota.
3. Implemente os seguintes métodos públicos:
    - `adicionarDrone`: recebe um `std::shared_ptr<Drone>` e o adiciona à lista de drones.
    - `removerDrone`: recebe um `id` e remove o drone correspondente da lista.
    - `exibirFrota`: itera sobre os drones e chama `exibirDetalhes` para cada drone.

### Exemplo de Uso Esperado:

```cpp
#include <iostream>
#include <vector>
#include <memory>
#include <Eigen/Dense>

int main() {
    std::shared_ptr<Drone> drone2 = std::make_shared<Drone>(2, Eigen::Vector3d(10.0, 10.0, 15.0));
    std::shared_ptr<Drone> drone3 = std::make_shared<Drone>(3, Eigen::Vector3d(20.0, 20.0, 5.0));

    Frota frota;
    frota.adicionarDrone(drone2);
    frota.adicionarDrone(drone3);
    frota.exibirFrota();

    return 0;
}
```

**Saída esperada:**

```
Drone ID: 2
Posição: [10, 10, 15]
Drone ID: 3
Posição: [20, 20, 5]
```

---

## Parte 3: Especializando a Classe Drone

### Instrução:

1. Crie uma classe derivada chamada `DroneCarga`, que herda de `Drone`.
2. Adicione os seguintes atributos privados:
    - `capacidadeCarga_` (double): capacidade máxima de carga do drone em quilos.
    - `cargaAtual_` (double): carga atual do drone.
3. Implemente:
    - Um construtor que inicializa `id_`, `posicao_`, `capacidadeCarga_` e define a `cargaAtual_` como zero.
    - Getters e setters para `capacidadeCarga_` e `cargaAtual_`. Certifique-se de que a `cargaAtual_` não ultrapasse a `capacidadeCarga_`.
    - Sobrescreva o método `exibirDetalhes` para incluir as informações de carga.

### Exemplo de Uso Esperado:

```cpp
int main() {
    DroneCarga drone4(4, Eigen::Vector3d(30.0, 30.0, 20.0), 50.0);
    drone4.setCargaAtual(25.0);
    drone4.exibirDetalhes();

    return 0;
}
```

**Saída esperada:**

```
Drone ID: 4
Posição: [30, 30, 20]
Capacidade de Carga: 50 kg
Carga Atual: 25 kg
```

---

<aside>
🚧

**GABARITO ABAIXO!!!**

</aside>

# Gabarito

## Parte 1: Criando a Classe Drone

```cpp
#include <iostream>
#include <Eigen/Dense>

class Drone {
private:
    int id_;
    Eigen::Vector3d posicao_;

public:
    //Construtor: opcao 1
    Drone(int id, Eigen::Vector3d posicao){
        id_ = id;
        posicao_ = posicao;
    }
    
		//Construtor: opcao 2
		//Drone(int id, Eigen::Vector3d posicao) : id_(id), posicao_(posicao) {}

    int getId() const {
        return id_;
    }

    Eigen::Vector3d getPosicao() const {
        return posicao_;
    }

    void setPosicao(const Eigen::Vector3d& novaPosicao) {
        posicao_ = novaPosicao;
    }

    void exibirDetalhes() const {
        std::cout << "Drone ID: " << id_ << "\n";
        std::cout << "Posição: [" << posicao_[0] << ", " << posicao_[1] << ", " << posicao_[2] << "]\n";
    }
};

int main() {
    Drone drone1(1, Eigen::Vector3d(0.0, 0.0, 10.0));
    drone1.exibirDetalhes();
    return 0;
}
```

<aside>
👉🏻

**OBS:** Em todos os momentos que usamos `id_` e `posicao_`, poderíamos estar usando `this->id_` ou `this->posicao_`.

O ponteiro `this` aponta para a instância atual da classe.

**Qual a diferença** 🤷🏻‍♂️**?**

`this->` indica que você está usando a variável do OBJETO atual. Ou seja, vamos supor que, invés de usar `id_` como variável privada, usamos `id`. Nosso construtor ficaria então:

```cpp
    Drone(int id, Eigen::Vector3d posicao){
        this->id = id;
        this->posicao = posicao;
    }
```

`this->id` é a variável do objeto da classe Drone, enquanto `id` é o argumento passado à função.

Como usamos `id_` nesse caso, ficaria redundante o uso de `this->`, mas é utilizado mesmo assim em muitos contextos como boa prática.

</aside>

---

## Parte 2: Manipulando uma Frota de Drones

```cpp
#include <iostream>
#include <vector>
#include <memory>
#include <Eigen/Dense>

class Drone {
private:
    int id_;
    Eigen::Vector3d posicao_;

public:
    Drone(int id, Eigen::Vector3d posicao) : id_(id), posicao_(posicao) {}

    int getId() const {
        return id_;
    }

    Eigen::Vector3d getPosicao() const {
        return posicao_;
    }

    void setPosicao(const Eigen::Vector3d& novaPosicao) {
        posicao_ = novaPosicao;
    }

    void exibirDetalhes() const {
        std::cout << "Drone ID: " << id_ << "\n";
        std::cout << "Posição: [" << posicao_[0] << ", " << posicao_[1] << ", " << posicao_[2] << "]\n";
    }

};

class Frota {
private:
    std::vector<std::shared_ptr<Drone>> drones_;

public:
    void adicionarDrone(const std::shared_ptr<Drone>& drone) {
        drones_.push_back(drone);
    }

    void removerDrone(int id){
        for (int i = 0; i < drones_.size(); i++) {
            if(drones_[i]->getId() == id){
                drones_.erase(drones_.begin() + i);
                break;
            }
        }
    }

    void exibirFrota() const {
        for (const auto& drone : drones_) {
            drone->exibirDetalhes();
        }
    }
};

int main() {
    std::shared_ptr<Drone> drone2 = std::make_shared<Drone>(2, Eigen::Vector3d(10.0, 10.0, 15.0));
    std::shared_ptr<Drone> drone3 = std::make_shared<Drone>(3, Eigen::Vector3d(20.0, 20.0, 5.0));

    Frota frota;
    frota.adicionarDrone(drone2);
    frota.adicionarDrone(drone3);
    frota.exibirFrota();

    return 0;
}
```

---

## Parte 3: Especializando a Classe Drone

```cpp
#include <iostream>
#include <Eigen/Dense>

class Drone {
private:
    int id_;
    Eigen::Vector3d posicao_;

public:
    Drone(int id, Eigen::Vector3d posicao) : id_(id), posicao_(posicao) {}

    int getId() const {
        return id_;
    }

    Eigen::Vector3d getPosicao() const {
        return posicao_;
    }

    void setPosicao(const Eigen::Vector3d& novaPosicao) {
        posicao_ = novaPosicao;
    }

    virtual void exibirDetalhes() const {
        std::cout << "Drone ID: " << id_ << "\n";
        std::cout << "Posição: [" << posicao_[0] << ", " << posicao_[1] << ", " << posicao_[2] << "]\n";
    }

    virtual ~Drone() = default;
};

class DroneCarga : public Drone {
private:
    double capacidadeCarga_;
    double cargaAtual_;

public:
		//Construtor: opcao 1
    DroneCarga(int id, Eigen::Vector3d posicao, double capacidadeCarga) : Drone(id, posicao){
    this->capacidadeCarga_ = capacidadeCarga;
    this->cargaAtual_ = 0.0;
}
		  
    //Construtor: opcao 2
    //DroneCarga(int id, Eigen::Vector3d posicao, double capacidadeCarga)
        //: Drone(id, posicao), capacidadeCarga_(capacidadeCarga), cargaAtual_(0.0) {}

    double getCapacidadeCarga() const {
        return capacidadeCarga_;
    }

    double getCargaAtual() const {
        return cargaAtual_;
    }

    void setCargaAtual(double novaCarga) {
        if (novaCarga <= capacidadeCarga_) {
            cargaAtual_ = novaCarga;
        } else {
            std::cout << "Erro: Carga excede a capacidade máxima!\n";
        }
    }

    void exibirDetalhes() const override {
        Drone::exibirDetalhes();
        std::cout << "Capacidade de Carga: " << capacidadeCarga_ << " kg\n";
        std::cout << "Carga Atual: " << cargaAtual_ << " kg\n";
    }
};

int main() {
    DroneCarga drone4(4, Eigen::Vector3d(30.0, 30.0, 20.0), 50.0);
    drone4.setCargaAtual(25.0);
    drone4.exibirDetalhes();

    return 0;
}
```

---

*Parabéns, você concluiu os Labs da Aula 1!! Tá codando tanto que começou a crescer barba no pesçoco* 🔥

### Voltar ao Menu de Aulas: [Navegação Autônoma](https://www.notion.so/Navega-o-Aut-noma-1586e2fe69c480a7b68cf652af2d931d?pvs=21)