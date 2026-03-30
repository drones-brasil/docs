# Lab 3 - Utilizando mensagens customizadas em ROS 2

<aside>
<img src="https://www.notion.so/icons/playback-play-button_purple.svg" alt="https://www.notion.so/icons/playback-play-button_purple.svg" width="40px" />

Nesse lab, vamos criar um novo tipo de mensagem de ROS2: `Dronezeiro.msg`. Com essa mensagem, vamos definir os campos de dados de um Dronezeiro e adaptar o Publisher e Subscriber da aula para lidar com isso

</aside>

## 1. Setup inicial

Antes de tudo, precisamos garantir que temos o workspace correto para o Laboratório.

1. Criar o workspace

Vamos criar um workspace no diretório `home` do nosso **WSL** e abrir o vscode nele:

```bash
cd ~
mkdir lab4_ws && cd lab4_ws && code .
```

2. Clonar os repositorios

No mesmo terminal de antes, escreva:

```bash
mkdir src && cd src
git clone https://github.com/Equipe-eVTOL-ITA/simple_pubsub.git
git clone https://github.com/Equipe-eVTOL-ITA/custom_msgs.git
```

3. Configurar os submodules

No VSCode, crie o arquivo `.gitmodules` na raiz do workspace  e escreva nele:

```bash
[submodule "src/simple_pubsub"]
    path = src/simple_pubsub
    url = https://github.com/Equipe-eVTOL-ITA/simple_pubsub.git
    
[submodule "src/custom_msgs"]
    path = src/custom_msgs
    url = https://github.com/Equipe-eVTOL-ITA/custom_msgs.git
```

Salve a modificação no arquivo (`Ctrl+S`)

Depois, abra um terminal no vscode (`Crtl+``) e escreva:

```bash
cd ~/lab4_ws
git init
git submodule update --init --recursive
```

---

## 2. Crie a mensagem customizada

No navegador de arquivos do vscode, navegue até a pasta `lab4_ws/src/custom_msgs/msg` e crie o arquivo `Dronezeiro.msg`.

![image.png](Lab%203%20-%20Utilizando%20mensagens%20customizadas%20em%20ROS%202/image.png)

Nesse arquivo, crie os seguintes campos **com os tipos adequados**:

- `nome`
- `diretoria`
- `idade`

Parar saber como criar uma mensagem nova de ROS 2, navegue pelas outras mensagens dessa pasta e veja como é a sintaxe.

---

## 3. Adapte os arquivos do `Publisher`e `Subscriber`

 

**Publisher:**

1. Mude o tipo de mensagem do publisher (lembre de importar o arquivo `Dronezeiro`).
2. Popule os campos da mensagem (`nome`, `diretoria` e `idade`) na função de callback da maneira correta.

**Subscriber:**

1. Mudar o tipo de mensagem do subscriber
2. Printe no terminal (função `get_logger()`) a mensagem de acordo com os campos dela.

---

## 4. Adapte o pacote

1. Adaptar o package.xml com as dependências corretas.

---

## **5. Buildar e executar o pacote**

1. Apagar a pasta `custom_msgs` da pasta `build` (caso ela exista)
2. Buildar novamente
    
    ```bash
    colcon build
    ```
    
3. Executar os  pacotes
    
    Primeiro terminal:
    
    ```bash
    source install/setup.bash
    ros2 run pubsub publisher
    ```
    
    Segundo terminal:
    
    ```bash
    source install/setup.bash
    ros2 run pubsub subscriber
    ```
    

---

## Gabarito

`Dronezeiro.msg`:

```
string nome
string diretoria
int32 idade
```

<aside>
💡

OBS: Outra alternativa para o campo `idade` seria `float32`. Nesse caso, o campo `msg.idade` no publisher deveria ser populado com um número que não seja inteiro (usar `msg.idade = 22` vai levar a erro).

</aside>

`publisher.py` (as linhas onde alguma coisa mudou têm um comentário em cima):

```python
import rclpy
from rclpy.node import Node
### IMPORTAR A MENSAGEM DRONEZEIRO DO PACOTE CUSTOM_MSGS
from custom_msgs.msg import Dronezeiro

class MinimalPublisher(Node):
    def __init__(self):
        super().__init__('minimal_publisher')
        ### MUDAR O TIPO DE MENSAGEM PARA DRONEZEIRO
        self.publisher_ = self.create_publisher(Dronezeiro, 'dronezada', 10)
        self.timer = self.create_timer(1.0, self.timer_callback)
        self.counter = 0

    def timer_callback(self):
        ### INICIALIZAR A MENSAGEM DRONEZEIRO E POPULAR OS CAMPOS DELA
        msg = Dronezeiro()
        msg.nome = "Vini"
        msg.diretoria = "Navegacao"
        msg.idade = 22
        self.publisher_.publish(msg)
        ### ADAPTAR O LOG PARA OS CAMPOS CORRETOS
        self.get_logger().info(f'Publishing: "{msg.nome}, {msg.diretoria}, {msg.idade}"')
        self.counter += 1

def main(args=None):
    rclpy.init(args=args)
    node = MinimalPublisher()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

`subscriber.py`:

```python
import rclpy
from rclpy.node import Node
### IMPORTAR A MENSAGEM CORRETA 
from custom_msgs.msg import Dronezeiro

class MinimalSubscriber(Node):
    def __init__(self):
        super().__init__('minimal_subscriber')
        ### MUDAR O TIPO DE MENSAGEM DO SUBSCRIBER
        self.subscription = self.create_subscription(
            Dronezeiro,
            'dronezada',
            self.listener_callback,
            10)
        self.subscription

    def listener_callback(self, msg):
        ### ADEQUAR O LOGGER PARA O EXEMPLO CORRETO
        self.get_logger().info(f'Eu ouvi do "{msg.nome} de {msg.idade} anos e da diretoria {msg.diretoria}"')

def main(args=None):
    rclpy.init(args=args)
    node = MinimalSubscriber()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

---

<aside>
💪🏻

Agora vamos praticar a criação de `package.xml` e de `CMakeLists.txt`.

</aside>

### Próximo: [Lab 4 - Praticando `package.xml` e `CMakeLists.txt`](Lab%204%20-%20Praticando%20package%20xml%20e%20CMakeLists%20txt%201ed6e2fe69c480e2ae90d2db9b8191e9.md)