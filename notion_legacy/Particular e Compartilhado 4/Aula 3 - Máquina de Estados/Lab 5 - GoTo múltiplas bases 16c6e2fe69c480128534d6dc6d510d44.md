# Lab 5 - GoTo múltiplas bases

## Introdução

Agora que nós vimos como fazer uma Máquina de Estados de Takeoff e Land usando a biblioteca `fsm`, vamos partir para um exemplo mais complexo.

<aside>
<img src="https://www.notion.so/icons/code_purple.svg" alt="https://www.notion.so/icons/code_purple.svg" width="40px" />

Sua tarefa é escrever uma FSM para **pousar o drone autonomamente em 5 bases com coordenadas conhecidas**.

</aside>

[fsm.mp4](Lab%205%20-%20GoTo%20m%C3%BAltiplas%20bases/fsm.mp4)

Para essa tarefa, vamos usar os seguinte estados:

- **Initial Takeoff State**: muda o drone para estado de OffBoard Control, arma os motores e decola até a altura de takeoff.
- **Visit Bases State:** desloca o drone horizontalmente até as coordenadas x e y da base (para esse exemplo, fornecemos as coordenadas conhecidas).
- **Landing State:** pousa o drone na altura da base.
- **Takeoff State:** decola o drone novamente até a altura de takeoff.
- **Return Home State:** retorna o drone horizontalmente até as coordenadas x e y da base inicial e depois pousa nela. No fim, desarma o drone.

> Há diversas maneiras de fazer o drone pousar nas 5 bases com uma FSM. Vamos utilizar essa estrutura para esse Lab.
🧞 **Desafio:** depois de resolver o Lab com esses estados, implemente maneiras diferentes de resolver o problema do pouso nas 5 bases.
> 

---

## Setup do ambiente para o Lab

Faça o setup que esta na seção 2 da aula.

---

## 1  Escrevendo a FSM `land_on_bases.cpp`

### 1.1 Crie um objeto da classe Drone com o Blackboard

Crie um objeto da classe Drone e o torne disponível no Blackboard:

```cpp
this->blackboard_set<Drone>(TODO);
```

### 1.2 Publique variáveis no Blackboard

Publique as seguinte variáveis no Blackboard:

```cpp
this->blackboard_set<TIPO>("NOME", VARIAVEL);
```

- `bases`: vetor de variáveis da struct Base.
- `home_position`: Eigen::Vector3d com a posição inicial
- `finished_bases`: booleano inicializado como falso.
- `initial_yaw`: é o terceiro elemento do Eigen::Vector3d `orientation`.
- `takeoff_height`: altura em que o drone deve se mover horizontalmente.

### 1.3 Adicione os Estados

Adicione os 5 estados mencionados acima à FSM.

```cpp
this->add_state("NOME", std::make_unique<CLASSE>());
```

### 1.4 Adicione as Transições

Adicione as transições entre os estados da FSM.

<aside>
💡

Lembrando que, para isso, você vai precisar escolher a string (`EVENTO_x`) que indica à FSM qual deve ser o próximo estado, e usar essa string na função `act` do estado para indicar que ele deve acabar.

</aside>

```cpp
this->add_transitions("NOME_DO_ESTADO",{
                        {"EVENTO_1", "PROX_ESTADO_1"},
                        {"EVENTO_2", "PROX_ESTADO_2"},
                        // ... Mais eventos e estados
                        {"SEG FAULT", "ERROR"}});
```

---

## 2 Escrevendo os States da FSM

Agora você está pronto para escrever os States da FSM e controlar a lógica de voo do seu drone.

Mas, antes, vou passar os bizus:

### 2.1 Instanciar a classe Drone

Em todos os estados, a primeira coisa a fazer é obter o objeto da classe Drone que instanciamos na FSM. É com ele que vamos nos comunicar com o PX4 para controlar o drone.

```cpp
  drone = blackboard.get<Drone>("drone");
  if (drone == nullptr) return;
  drone->log("STATE: LANDING");
```

### 2.2 Principais funções da classe Drone

- `drone->toOffboardSync()`: muda o modo de voo do Drone para OffboardControl. É necessário usar essa função no InitialTakeoff para poder controlar o drone com ROS 2. Use na função `on_enter()`.

- `drone->armSync()`: arma os motores do drone. É necessário usar no InitialTakeoff na função `on_enter()` antes de enviar comandos de movimento.

- `drone->log(STRING)`: printa no terminal informações úteis para debuggar. Exemplo:
    
    ```cpp
    initial_yaw = *blackboard.get<float>("initial_yaw");
    drone->log("O yaw inicial eh: " + std::to_string(initial_yaw) + " rads.");
    ```
    
- `drone->getLocalPosition()`: retorna um `Eigen::Vector3d` das coordenadas x, y e z do drone. Exemplo:
    
    ```cpp
    Eigen::Vector3d position = drone->getLocalPosition();
    float x_atual = position[0];
    float y_atual = position.y();
    float zero_burro = position[2] - position.z();
    ```
    

- `drone->getLocalVelocity()`: retorna um `Eigen::Vector3d` das velocidades vx, vy e vz do drone. Exemplo:
    
    ```cpp
    Eigen::Vector3d velocity = drone->getLocalVelocity();
    float vx = velocity.x();
    ```
    
- `drone->getOrientation()`: retorna um `Eigen::Vector3d` da orientação do drone (roll, pitch & yaw).  Exemplo:
    
    ```cpp
    Eigen::Vector3d orientation = drone->getOrientation();
    float yaw = orientation[2]; // ou yaw = orientation.z()
    ```
    

- `drone->setLocalPosition(goal_x, goal_y, goal_z, goal_yaw)`: recebe 4 floats e envia o drone para aquela posição. Exemplo:
    
    ```cpp
    float initial yaw = drone->getOrientation().z();
    drone->setLocalPosition(1.0, 1.5, -2.0, initial_yaw);
    ```
    

- `drone->setLocalVelocity(goal_vx, goal_vy, goal_vz, goal_yawspeed)`: recebe 4 floats e controla o drone para atingir a velocidade dada. Por default, `goal_yawspeed=0.0`, então você pode usar essa função somente com os 3 primeiros valores. Exemplo:
    
    ```cpp
    drone->setLocalVelocity(0.0, 0.0, 1.5); // Descer a 1.5 m/s
    ```
    

- `drone->land`: muda o modo de voo do Drone para Land. Depois de fazer isso, você vai precisar usar a função `drone->toOffboardSync()` novamente porque o drone não estará mais no modo de OffboardControl.

- `drone->disarmSync()`: desarma os motores do drone (drone vai de necas).

### 2.3 Declarar variável como privada ou na função `on_enter`

- **Variável privada**: isso significa que ela vai estar acessível em todas as funções. Exemplo:
    
    ```cpp
    public:
    	...
    	void on_enter(fsm::Blackboard &blackboard) override {
    		...
    		goal_x = *blackboard.get<float>("X coordinate to move to");
    	}
    
    	std::string act(fsm::Blackboard &blackboard) override {
    		...
    		drone->setLocalPosition(goal_x, 0.0, 0.0, 0.0);
    		...
    	}
    	
    ...
    
    private:
    	float goal_x;
    ```
    
- **Variável da função `on_enter`**: ela só existe no escopo dessa função e não é acessível nas outras.
    
    ```cpp
    public:
    	...
    	void on_enter(fsm::Blackboard &blackboard) override {
    		...
    		float goal_x = *blackboard.get<float>("X coordinate to move to");
    	}
    
    	std::string act(fsm::Blackboard &blackboard) override {
    		...
    		drone->setLocalPosition(goal_x, 0.0, 0.0, 0.0);
    		// VAI DAR ERRO: goal_x NÃO EXISTE AQUI
    		...
    	}
    ```
    

---

## Gabarito

<aside>
🗣

Lembrando que esse gabarito não é único. É perfeitamente plausível que você escolha formas de lidar com o voo diferentes. O importante (e difícil 🥵) é fazer o drone **voar bem**.

</aside>

### 1  Escrevendo a FSM `land_on_bases.cpp`

```cpp
        // 1.1 Instancie a Classe Drone
        this->blackboard_set<Drone>("drone", new Drone());
        Drone* drone = blackboard_get<Drone>("drone");
        
        
        // 1.2 Publique variaveis no Blackboard
        this->blackboard_set<std::vector<Base>>("bases", bases);
        this->blackboard_set<Eigen::Vector3d>("home_position", home_pos);
        this->blackboard_set<bool>("finished_bases", false);
        this->blackboard_set<float>("initial_yaw", orientation[2]);
        this->blackboard_set<float>("takeoff_height", -3.0);

        // 1.3 Adicione os Estados
        this->add_state("INITIAL TAKEOFF", std::make_unique<InitialTakeoffState>());
        this->add_state("VISIT BASE", std::make_unique<VisitBasesState>());
        this->add_state("LANDING", std::make_unique<LandingState>());
        this->add_state("TAKEOFF", std::make_unique<TakeoffState>());
        this->add_state("RETURN HOME", std::make_unique<ReturnHomeState>());

        //1.4 Adicione as Transições

        // Initial Takeoff transitions
        this->add_transitions("INITIAL TAKEOFF", {{"INITIAL TAKEOFF COMPLETED", "VISIT BASE"},{"SEG FAULT", "ERROR"}});

        // Visit Base transitions
        this->add_transitions("VISIT BASE", {{"ARRIVED AT BASE", "LANDING"},{"SEG FAULT", "ERROR"}});

        // Landing transitions
        this->add_transitions("LANDING", {{"LANDED", "TAKEOFF"},{"SEG FAULT", "ERROR"}});

        // Takeoff transitions
        this->add_transitions("TAKEOFF",{
                                {"NEXT BASE", "VISIT BASE"},
                                {"FINISHED BASES", "RETURN HOME"},
                                {"SEG FAULT", "ERROR"}});

        // Return Home transitions
        this->add_transitions("RETURN HOME", {{"AT HOME", "FINISHED"},{"SEG FAULT", "ERROR"}});
```

### 2 Escrevendo os States da FSM

Gabarito sugerido vai estar disponível no GitHub do Treinamento.

---

<aside>
🚀

Parabéns, você acabou os Labs da Aula 3!!

</aside>

### Voltar ao menu: [Navegação Autônoma](https://www.notion.so/Navega-o-Aut-noma-1586e2fe69c480a7b68cf652af2d931d?pvs=21)