# Lab 4 - Praticando package.xml e CMakeLists.txt

## Introdução

Neste exemplo, criaremos os arquivos `package.xml` e `CMakeLists.txt` para um pacote ROS 2 em C++ que implementa tarefas de visão computacional. O node se inscreve em um tópico que publica imagens, realiza operações de visão computacional e utiliza diversas bibliotecas e mensagens. O código fonte está organizado da seguinte forma:

```
my_vision_package/
├── src/
│   └── vision_node.cpp
├── include/
│   └── my_vision_package/
│       └── vision_node.hpp
```

### Arquivo `src/vision_node.cpp`

```cpp
#include <rclcpp/rclcpp.hpp>
#include <sensor_msgs/msg/image.hpp>
#include <px4_msgs/msg/vehicle_odometry.hpp>
#include <vision_msgs/msg/detection2_d_array.hpp>
#include <opencv2/opencv.hpp>
#include <Eigen/Dense>

class VisionNode : public rclcpp::Node
{
public:
    VisionNode() : Node("vision_node")
    {
        image_subscription_ = this->create_subscription<sensor_msgs::msg::Image>(
            "/camera/image_raw", 10,
            std::bind(&VisionNode::process_image, this, std::placeholders::_1));
        odometry_subscription_ = this->create_subscription<px4_msgs::msg::VehicleOdometry>(
            "/vehicle/odometry", 10,
            std::bind(&VisionNode::process_odometry, this, std::placeholders::_1));
    }

private:
    void process_image(const sensor_msgs::msg::Image::SharedPtr msg)
    {
        // Processamento de imagem usando OpenCV
        cv::Mat image;
        // ... código fictício para demonstrar dependência do OpenCV ...
    }

    void process_odometry(const px4_msgs::msg::VehicleOdometry::SharedPtr msg)
    {
        // Processamento de odometria usando Eigen
        Eigen::Vector3d position(msg->x, msg->y, msg->z);
        // ... código fictício para demonstrar dependência do Eigen ...
    }

    rclcpp::Subscription<sensor_msgs::msg::Image>::SharedPtr image_subscription_;
    rclcpp::Subscription<px4_msgs::msg::VehicleOdometry>::SharedPtr odometry_subscription_;
};

int main(int argc, char *argv[])
{
    rclcpp::init(argc, argv);
    rclcpp::spin(std::make_shared<VisionNode>());
    rclcpp::shutdown();
    return 0;
}
```

### Arquivo `include/my_vision_package/vision_node.hpp`

```cpp
#ifndef MY_VISION_PACKAGE__VISION_NODE_HPP_
#define MY_VISION_PACKAGE__VISION_NODE_HPP_

#include <rclcpp/rclcpp.hpp>
#include <sensor_msgs/msg/image.hpp>
#include <px4_msgs/msg/vehicle_odometry.hpp>
#include <opencv2/opencv.hpp>
#include <Eigen/Dense>

class VisionNode : public rclcpp::Node
{
public:
    VisionNode();

private:
    void process_image(const sensor_msgs::msg::Image::SharedPtr msg);
    void process_odometry(const px4_msgs::msg::VehicleOdometry::SharedPtr msg);

    rclcpp::Subscription<sensor_msgs::msg::Image>::SharedPtr image_subscription_;
    rclcpp::Subscription<px4_msgs::msg::VehicleOdometry>::SharedPtr odometry_subscription_;
};

#endif  // MY_VISION_PACKAGE__VISION_NODE_HPP_
```

Com base nos includes e funcionalidades usadas no código, identifique as dependências necessárias e prossiga para escrever os arquivos `package.xml` e `CMakeLists.txt`.

---

## Dependências

Identifique quais os pacotes que são dependência do `my_vision_package`, analisando os `#include`.

---

## `package.xml`

### Passo 1.1: Configurar as informações básicas do pacote

1. Escreva o nome do pacote (`my_vision_package`) e sua versão (`0.1.0`).
2. Adicione uma descrição curta do pacote.
3. Inclua o nome e e-mail do mantenedor.
4. Declare a licença (por exemplo, MIT).

### Passo 1.2: Declarar as dependências

Adicione as dependências de build e execução:

### Passo 1.3: Finalizar o arquivo

Adicione a tag `<export>` no final, mesmo que não inclua informações adicionais.

---

## `CMakeLists.txt`

### Passo 2.1: Configurações iniciais

1. Defina a versão mínima do CMake.
2. Declare o nome do projeto (`my_vision_package`).

### Passo 2.2: Encontrar pacotes e bibliotecas

1. Use `find_package` para localizar as dependências listadas no `package.xml`.
2. Certifique-se de incluir pacotes ROS 2 como `rclcpp`, `px4_msgs` e `vision_msgs`, além de bibliotecas externas como `OpenCV` e `Eigen3`.

### Passo 2.3: Adicionar o executável

1. Especifique o arquivo fonte (`src/vision_node.cpp`).
2. Configure as dependências do executável usando `ament_target_dependencies`.
3. Inclua o diretório de cabeçalhos (`include/`).

### Passo 2.4: Configurar a instalação

1. Configure onde o binário deve ser instalado (`lib/my_vision_package`).
2. Finalize com `ament_package()`.

---

## Gabarito

### Dependências

- `ament_cmake` (ferramenta de build).
- `rclcpp` (framework ROS 2 para C++).
- `sensor_msgs` (para lidar com mensagens de sensores como imagens).
- `px4_msgs` e `vision_msgs` (mensagens usadas no node).
- `opencv` e `eigen3` (bibliotecas externas).

### Arquivo `package.xml`

```xml
<package format="3">
  <name>my_vision_package</name>
  <version>0.1.0</version>
  <description>Node ROS 2 para visão computacional usando OpenCV e Eigen3.</description>

  <maintainer email="seuemail@exemplo.com">Seu Nome</maintainer>
  <license>MIT</license>

  <buildtool_depend>ament_cmake</buildtool_depend>
  <depend>rclcpp</depend>
  <depend>sensor_msgs</depend>
  <depend>px4_msgs</depend>
  <depend>vision_msgs</depend>
  <depend>opencv</depend>
  <depend>eigen3</depend>

  <export>
  </export>
</package>
```

### Arquivo `CMakeLists.txt`

```
cmake_minimum_required(VERSION 3.8)
project(my_vision_package)

# Encontrar pacotes necessários
find_package(ament_cmake REQUIRED)
find_package(rclcpp REQUIRED)
find_package(sensor_msgs REQUIRED)
find_package(px4_msgs REQUIRED)
find_package(vision_msgs REQUIRED)
find_package(OpenCV REQUIRED)
find_package(Eigen3 REQUIRED)

# Incluir diretórios
include_directories(include)

# Adicionar executável
add_executable(
  vision_node
  src/vision_node.cpp
)
ament_target_dependencies(
  vision_node
  rclcpp sensor_msgs px4_msgs vision_msgs OpenCV Eigen3
)

# Instalar executável
install(TARGETS
  vision_node
  DESTINATION lib/${PROJECT_NAME}
)

# Finalizar pacote
ament_package()
```

---

<aside>
🎊

Você finalizou todos os labs dessa aula, parabéns!

</aside>

### Voltar ao menu: [Treinamento 2025](https://www.notion.so/Treinamento-2025-1586e2fe69c480b4bb49e2f4402c214a?pvs=21)