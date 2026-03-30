# 2. Configurando o Workspace

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
git clone --branch aula4 https://github.com/Equipe-eVTOL-ITA/simple_fsm.git
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
    branch = aula4
```

Depois, no terminal, escreva:

```bash
cd ~/drone_ws
git init
git submodule update --init --recursive
```

---

## 4. Buildar o workspace

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

## 5. Rodando a simulação

Abra a pasta `frtl_2025_ws` no vscode:

```bash
cd ~/frtl_2025_ws && code.
```

Agora, vamos rodar a simulação:

1. Pressione `Ctrl + Shift + P`
2. Escreva `Run Task` e selecione o `Tasks: Run Task`
3. Selecione a task `simulate & image bridge & agent`
4. Selecione o mundo `sae_3`

Se deu certo, a aba do Gazebo deve abrir com a simulação. 

---

## 6. Rodando os pacotes

Agora vamos controlar o dronne em OffboardControl. Na aba do vscode aberto no `drone_ws`, rode no terminal:

```bash
source install/setup.bash
ros2 run drone_control takeoff_landing
```

---

<aside>
⏭️

Próxima seção:

</aside>

### Próximo: [3. Compreendendo px4_msgs e Agente DDS](3%20Compreendendo%20px4_msgs%20e%20Agente%20DDS%2016f6e2fe69c4809bb7def9795c620be2.md)