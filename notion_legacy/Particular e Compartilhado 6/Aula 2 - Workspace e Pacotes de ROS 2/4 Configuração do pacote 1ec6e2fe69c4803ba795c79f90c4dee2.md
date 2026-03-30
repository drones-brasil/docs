# 4. Configuração do pacote

## 1. Package.xml

> Pense no package.xml como a ficha técnica do pacote: nome, versão, autor e tudo que ele precisa para funcionar, especialmente **dependências** do pacote.
> 

### Estrutura Básica de um `package.xml`

A seguir, apresentamos um exemplo simples de um arquivo `package.xml`:

```xml
<package format="3">
  <name>drone_control</name>
  <version>0.1.0</version>
  <description>Pacote para controlar o drone e interagir com o PX4</description>

  <maintainer email="evtol.ita@gmail.com">eVTOL ITA</maintainer>
  <license>MIT</license>

  <buildtool_depend>ament_cmake</buildtool_depend>

  <depend>rclcpp</depend>
  <depend>px4_msgs</depend>
  <depend>sensor_msgs</depend>

  <test_depend>ament_lint_auto</test_depend>
  <test_depend>ament_cmake_pytest</test_depend>

  <export>
  </export>
</package>
```

### Componentes do `package.xml`

1. **Cabeçalho:**
    - `<package format="3">`: Declara o formato do pacote. A versão mais recente é a 3.
2. **Identificação do pacote:**
    - `<name>`: Nome do pacote. Deve ser único dentro do workspace.
    - `<version>`: Versão do pacote, que ajuda no controle de atualizações.
    - `<description>`: Uma descrição curta sobre o que o pacote faz.
3. **Mantenedores e Licença:**
    - `<maintainer>`: Nome e e-mail do responsável pelo pacote.
    - `<license>`: Licença do pacote. Por exemplo, MIT, Apache 2.0, etc.
4. **Dependências:**
    - `<buildtool_depend>`: Ferramentas necessárias para compilar o pacote, como `ament_cmake`.
    - `<depend>`: Dependências gerais usadas no runtime e na compilação, como `rclcpp` e `px4_msgs`.
    - `<test_depend>`: Dependências necessárias para testes automatizados.
5. **Exportação:**
    - A tag `<export>` pode incluir informações adicionais, mas geralmente é deixada vazia.

> Esses elementos garantem que o ROS 2 saiba exatamente como lidar com o pacote e que outros desenvolvedores consigam utilizá-lo sem surpresas.
> 

### Exemplo de Problema com package.xml

Imagine o seguinte cenário:

- Você desenvolveu um pacote chamado `vision_module` em seu computador e incluiu a biblioteca `cv_bridge` no código para converter imagens de ROS para OpenCV.
- No seu computador, a biblioteca `cv_bridge` já estava instalada porque você a usou em outros projetos, mas você esqueceu de declará-la no `package.xml`.

**Resultado:** O pacote funcionou perfeitamente no seu computador, mas quando você passou o workspace para uma Jetson Nano de outro desenvolvedor, o pacote não compilava. O erro era claro: a dependência `cv_bridge` não estava presente no `package.xml`.

> Esse tipo de problema acontece porque o package.xml é o único lugar que documenta formalmente as dependências. Se uma dependência não está listada, o rosdep não tem como instalá-la automaticamente.
> 

Para evitar isso:

- Sempre declare todas as dependências no `package.xml`, mesmo que já estejam instaladas no seu computador.
- Use o `rosdep` regularmente para verificar se todas as dependências podem ser resolvidas corretamente em um ambiente limpo.

---

## 2. CMakeLists.txt

Utilizado para pacotes que contêm código escrito em C++ ou que dependem de bibliotecas C++.

- Define como compilar os executáveis e bibliotecas do pacote.
- Configura dependências e caminhos de instalação.

### Escrevendo o `CMakeLists.txt`

Aqui está um exemplo detalhado de um `CMakeLists.txt` para um pacote ROS 2 em C++:

```makefile
cmake_minimum_required(VERSION 3.8)
project(drone_control)

# Encontrar pacotes necessários
find_package(ament_cmake REQUIRED)
find_package(rclcpp REQUIRED)
find_package(px4_msgs REQUIRED)

# Adicionar executáveis
add_executable(controller_node
  src/controller_node.cpp
)
ament_target_dependencies(controller_node
  rclcpp
  px4_msgs
)

# Instalar executáveis
install(TARGETS
  controller_node
  DESTINATION lib/${PROJECT_NAME}
)

# Finalizar o pacote
ament_package()
```

### Componentes Principais do `CMakeLists.txt`

1. **`cmake_minimum_required` e `project`:**
    - Define a versão mínima do CMake e o nome do projeto.
2. **`find_package`:**
    - Localiza os pacotes e bibliotecas necessários.
    - **Por que o `REQUIRED`?** Ele garante que o CMake irá interromper o processo de build caso o pacote não seja encontrado, evitando erros mais tarde. Sem o `REQUIRED`, o processo continuaria, mas falharia em partes posteriores do build.
3. **`add_executable`:**
    - Adiciona um executável ao pacote. No contexto do `ros2 run`, o executável é o arquivo binário gerado pelo compilador, que pode ser executado diretamente no terminal.
    - Aqui, estamos criando um executável chamado `controller_node` a partir do arquivo `src/controller_node.cpp`.
4. **`ament_target_dependencies`:**
    - Define as dependências do executável, como bibliotecas que ele utiliza.
5. **`install`:**
    - Configura onde o executável será instalado no sistema.
    - O `DESTINATION lib/${PROJECT_NAME}` significa que o binário será colocado dentro de uma pasta específica do pacote no diretório de instalação (`install/lib/<nome_do_pacote>`). Isso facilita o `ros2 run` encontrar o executável.
6. **`ament_package`:**
    - Finaliza a configuração do pacote, permitindo sua integração com o ROS 2.

---

## 3. setup.py

Utilizado para pacotes que contêm código Python.

- Configura a instalação de scripts Python e bibliotecas.
- Define dependências e pacotes associados.

```python
from setuptools import setup
from glob import glob
import os

package_name = 'vision_module'

setup(
    name=package_name,
    version='0.1.0',
    packages=[package_name],
    data_files=[
        ('share/' + package_name, ['package.xml']),
        (os.path.join('share', package_name, 'launch'), glob('launch/*.py')),
    ],
    install_requires=['setuptools'],
    zip_safe=True,
    maintainer='seu_nome',
    maintainer_email='seu_email@exemplo.com',
    description='Pacote para processamento de imagens',
    license='MIT',
    entry_points={
        'console_scripts': [
            'image_processor = vision_module.image_processor:main',
        ],
    },
)
```

### Componentes Principais do `setup.py`

1. **`name` e `version`:**
    - Nome e versão do pacote.
2. **`packages`:**
    - Lista de pacotes Python incluídos.
3. **`data_files`:**
    - Define arquivos adicionais que devem ser instalados junto com o pacote.
    - Por exemplo, `package.xml` é necessário para que o ROS 2 reconheça o pacote, e arquivos de lançamento (`.py`) são usados para automatizar a inicialização de nodes e configurações.
4. **`install_requires`:**
    - Dependências Python necessárias.
5. **`entry_points`:**
    - Scripts que podem ser executados diretamente como comandos no terminal.
    - Nesse caso, o nome do pacote é `vision_module` e do executável é `image_processor`. Se rodarmos `ros2 run vision_module image_processor`, ele vai executar a função main do arquivo `vision_module/image_processor.py`.

> O setup.py organiza tudo o que um pacote Python precisa para ser usado no ROS 2.
> 

---

## 4. Erros Comuns

1. **Esqueci de adicionar um executável ao `CMakeLists.txt`:**
    - **Como Identificar:** O build será bem-sucedido, mas ao rodar `ros2 run`, você verá:
        
        ```
        [ERROR] [launch]: executable 'controller_node' not found on the libexec directory
        ```
        
    - **Resultado:** O executável não será gerado ou instalado.
    
2. **Esqueci de declarar um `find_package` no `CMakeLists.txt`:**
    - **Como Identificar:** O erro exibido será:
        
        ```
        CMake Error at CMakeLists.txt:5 (find_package):
        By not providing "Findpx4_msgs.cmake", CMake was unable to find a package configuration file.
        ```
        
    - **Resultado:** O build falhará porque o CMake não encontrará as dependências.
    
3. **Esqueci de incluir o `package.xml` no `setup.py`:**
    - **Como Identificar:** O comando `ros2 pkg list` não mostrará seu pacote, mesmo após a instalação.
        
        ```
        $ ros2 pkg list | grep vision_module
        (nenhum resultado)
        ```
        
    - **Resultado:** O ROS 2 não reconhecerá o pacote.
    
4. **Coloquei o nome errado no `entry_points` do `setup.py`:**
    - **Como Identificar:** Ao rodar o comando definido no `entry_points`, aparecerá:
        
        ```
        command not found: image_processor
        ```
        
    - **Resultado:** O comando não será encontrado no terminal.
    
5. **Não declarei um diretório de instalação no `CMakeLists.txt`:**
    - **Como Identificar:** O build será bem-sucedido, mas ao tentar rodar o executável, aparecerá:
        
        ```
        file or directory not found: controller_node
        ```
        
    - **Resultado:** Os binários podem ser instalados em locais não padrão, dificultando a execução.

## 5. Resumo

1. **`package.xml`:**
    - Contém as informações sobre o pacote, como nome, versão, mantenedores e dependências.
    - Serve como o "cartão de visita" do pacote para o ROS 2.
2. **`CMakeLists.txt`:**
    - Arquivo de configuração para compilar o código e gerar executáveis.
    - Define como o ROS 2 deve compilar os nodes e os arquivos de mensagens do pacote.
3. **`src/`:**
    - Diretório onde está o código-fonte, geralmente escrito em C++ ou Python.
    - Exemplo: Um node em C++ que recebe odometria do drone e publica comandos de controle.
4. **`include/`:**
    - Contém arquivos de cabeçalho (headers) que definem as funções ou classes usadas no pacote.
    - Necessário principalmente para projetos em C++.
5. **`launch/`:**
    - Diretório para arquivos de launch, que iniciam nodes e configuram parâmetros.
    - Exemplo: Um arquivo `.launch.py` para inicializar simultaneamente os nodes de controle e fusão de sensores.

> Esses componentes trabalham juntos para transformar um monte de códigos e arquivos em uma funcionalidade que o drone realmente pode usar.
> 

---

<aside>
⏭️

Próxima aula:

</aside>

### Próximo: [5. Build do pacote](5%20Build%20do%20pacote%201ec6e2fe69c480e3b3a4c0ee171c7c1f.md)