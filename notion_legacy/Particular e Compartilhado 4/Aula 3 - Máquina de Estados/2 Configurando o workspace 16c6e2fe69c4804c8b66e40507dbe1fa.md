# 2. Configurando o workspace

## 1. Criar o workspace

```bash
cd ~
mkdir drone_ws
cd drone_ws
code .
```

---

## 2. Clonar os repositorios

```bash
mkdir src && cd src
git clone https://github.com/Equipe-eVTOL-ITA/custom_msgs.git
git clone --branch main https://github.com/Equipe-eVTOL-ITA/fsm.git
git clone --branch release/1.15 --recursive https://github.com/PX4/px4_msgs.git
git clone https://github.com/Equipe-eVTOL-ITA/simple_fsm.git
```

---

## 3. Configurar os submodules

Crie o arquivo `.gitmodules` na raiz do workspace e escreva nele:

```bash
[submodule "src/custom_msgs"]
    path = src/custom_msgs
    url = https://github.com/Equipe-eVTOL-ITA/custom_msgs.git

[submodule "src/fsm"]
    path = src/fsm
    url = https://github.com/Equipe-eVTOL-ITA/fsm.git
    branch = main
    
[submodule "src/px4_msgs"]
    path = src/px4_msgs
    url = https://github.com/PX4/px4_msgs.git
    branch = release/1.15
    
[submodule "src/simple_fsm"]
    path = src/simple_fsm
    url = https://github.com/Equipe-eVTOL-ITA/simple_fsm.git
```

Depois, no terminal, escreva:

```bash
cd ~/drone_ws
git init
git submodule update --init --recursive
```

---

## 4. Explicando os pacotes `fsm`, `simple_fsm`e `px4_msgs`

### A biblioteca `simple_fsm`

A biblioteca `simple_fsm` é uma implementação simples de fsm para controle do drone. Ela possui dois pacotes:

- `drone_lib`: na Classe Drone, está implementada toda a comunicação de ROS 2 e de PX4 (controladora do drone)
- `drone_control`: possui as Máquinas de Estados, nas quais você se preocupa apenas com a lógica de voo, deixando a comunicação mais complexa em `drone_lib`.

### px4_msgs

É o conjunto de mensagens PX4 implementadas na linguagem ROS 2 (lembre: mensagem = como você organizou as informações sendo enviadas no ROS 2).

### A biblioteca `fsm`

A biblioteca `fsm` é um template para criar máquinas de estados. A implementação das classes `fsm::State` e  `fsm::FSM`cuida dos detalhes, como gerenciar transições, verificar se os estados existem e mudar entre eles. 

Nossa tarefa é apenas preencher os comportamentos específicos de cada estado (`on_enter`, `act`, `on_exit`) e configurar a máquina adicionando estados, transições e resultados esperados. 

---

## 5. Buildar o workspace

Para que as pastas `build`, `install` e `log` nao sejam publicadas no repositorio do workspace, vamos criar um arquivo `.gitignore`e escrever nele: 

```bash
build/
install/
log/
```

Agora, no terminal:

```bash
cd ~/drone_ws
source /opt/ros/humble/setup.bash
colcon build
```

---

<aside>
⏭️

Próxima seção da aula:

</aside>

### Próximo: [3. Controlando o drone por FSM](3%20Controlando%20o%20drone%20por%20FSM%201f46e2fe69c4805e86e4d6fef44bed9d.md)