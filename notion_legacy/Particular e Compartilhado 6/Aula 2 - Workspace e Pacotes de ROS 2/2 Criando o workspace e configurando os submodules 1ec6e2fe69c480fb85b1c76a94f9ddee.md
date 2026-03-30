# 2. Criando o workspace e configurando os submodules

## 1. Criar o workspace

```bash
cd ~
mkdir evtol_ws && cd evtol_ws && code .
```

---

## 2. Clonar os repositorios

```bash
mkdir src && cd src
git clone https://github.com/Equipe-eVTOL-ITA/simple_pubsub.git
git clone https://github.com/Equipe-eVTOL-ITA/pubsub_cpp.git
git clone https://github.com/Equipe-eVTOL-ITA/custom_msgs.git
git clone https://github.com/Equipe-eVTOL-ITA/camera_publisher.git
```

---

## 3. Configurar os submodules

Crie o arquivo `.gitmodules` na raiz do workspace e escreva nele:

```bash
[submodule "src/simple_pubsub"]
    path = src/simple_pubsub
    url = https://github.com/Equipe-eVTOL-ITA/simple_pubsub.git
    
[submodule "src/pubsub_cpp"]
    path = src/pubsub_cpp
    url = https://github.com/Equipe-eVTOL-ITA/pubsub_cpp.git
    
[submodule "src/custom_msgs"]
    path = src/custom_msgs
    url = https://github.com/Equipe-eVTOL-ITA/custom_msgs.git
    
[submodule "src/camera_publisher"]
    path = src/camera_publisher
    url = https://github.com/Equipe-eVTOL-ITA/camera_publisher.git
```

Depois, no terminal, escreva:

```bash
cd ~/evtol_ws
git init
git submodule update --init --recursive
```

---

## 4. Buildar o workspace

```bash
cd ~/evtol_ws
source /opt/ros/humble/setup.bash
colcon build
```

Para que as pastas `build`, `install` e `log` não sejam publicadas no repositório do workspace, vamos criar um arquivo `.gitignore`e escrever nele: 

```bash
build/
install/
log/
```

---

## 5. Utilizando o pacote simple_pubsub

No primeiro terminal:

```bash
source install/setup.bash
ros2 run pubsub publisher
```

No segundo terminal:

```bash
source install/setup.bash
ros2 run pubsub subscriber
```

No terceiro terminal:

```bash
ros2 topic list
ros2 topic echo /dronezada
```

## 6. Imagens: pacote camera_publisher

No terminal, rode:

```bash
source install/setup.bash
ros2 run camera_publisher webcam
```

Em outro terminal, rode:

```bash
source /opt/ros/humble/setup.bash
rqt
```

---

<aside>
⏭️

Próxima aula:

</aside>

### Próximo: [3. Escrevendo o Publisher e o Subscriber](3%20Escrevendo%20o%20Publisher%20e%20o%20Subscriber%201ec6e2fe69c480a29beef521dc98e848.md)