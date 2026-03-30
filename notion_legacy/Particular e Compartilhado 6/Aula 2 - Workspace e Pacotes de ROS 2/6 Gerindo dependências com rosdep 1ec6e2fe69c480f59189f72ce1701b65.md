# 6. Gerindo dependências com rosdep

### O que o `rosdep` faz com o `package.xml`

O `rosdep` lê o arquivo `package.xml` para identificar todas as dependências do pacote e garantir que elas estejam instaladas no sistema. Ele verifica cada dependência declarada e tenta instalá-la automaticamente usando o gerenciador de pacotes do sistema operacional (como `apt` no Ubuntu).

Se o `package.xml` estiver incompleto ou incorreto, o `rosdep` não conseguirá identificar e instalar as dependências necessárias. Isso pode levar a erros ao tentar executar ou compilar o pacote em outro computador.

---

### Diferença entre `build_depend`, `exec_depend` e `depend`

1. **`build_depend`:**
    - Usada durante o processo de build do pacote. Inclui bibliotecas e ferramentas necessárias apenas para compilar o código.
    - Exemplo: `ament_cmake` para pacotes ROS 2 em C++.

1. **`exec_depend`:**
    - Necessária apenas durante a execução do pacote, não no processo de build.
    - Exemplo: `vision_msgs`, se você precisa apenas das mensagens definidas sem compilar nada relacionado a elas.

1. **`depend`:**
    - Combina as funcionalidades de `build_depend` e `exec_depend`. Use quando a dependência é necessária tanto no build quanto na execução.
    - Exemplo: `rclcpp` para um pacote C++ que depende dessa biblioteca para compilar e executar nodes.

> Lembre-se: usar a tag correta para cada dependência ajuda a evitar erros e a otimizar o ambiente de desenvolvimento.
> 

---

### Erros Comuns ao Declarar Dependências

1. **Declarei a dependência no `package.xml`, mas ela não é usada no código:**
    - O build não será afetado, mas a manutenção será prejudicada, pois outros desenvolvedores podem achar que a dependência é necessária.

1. **Usei a dependência no código, mas ela não consta no `package.xml`:**
    - O build falhará, pois o sistema não encontrará a dependência.

1. **Declarei como `depend`, mas é apenas `build_depend`:**
    - O pacote pode funcionar, mas instaladores como `rosdep` instalarão dependências desnecessárias para execução. A pasta `install/` vai ficar mais pesada que o necessário.

1. **Declarei como `depend`, mas é apenas `exec_depend`:**
    - Ferramentas de build podem tentar usar dependências desnecessárias, causando erros ou warnings. Também, a pasta `build/` vai ficar mais pesada que o necessário e o tempo para buildar vai ser mais longo.

---

### Utilizando o `rosdep`

`rosdep` é uma ferramenta que gerencia dependências de pacotes ROS 2, instalando automaticamente as bibliotecas necessárias com base no `package.xml`.

1. **Instalando Dependências:**
    - Execute:
        
        ```bash
        rosdep install --from-paths src --ignore-src -r -y
        ```
        
    - Isso instala todas as dependências listadas no `package.xml` dos pacotes no diretório `src/`.
2. **Verificando Problemas:**
    - Se uma dependência não estiver disponível no repositório do `rosdep`, será exibido um erro.
3. **Configurando Dependências Personalizadas:**
    - Se uma dependência não está no repositório oficial, crie uma entrada local:
        
        ```bash
        echo "pacote_customizado:
          ubuntu: [comando_para_instalar]" >> /etc/ros/rosdep/sources.list.d/50-my-custom-rules.yaml
        ```
        
    - Depois, atualize o `rosdep`:
        
        ```bash
        rosdep update
        ```
        

---

<aside>
💪🏻

Agora é hora de praticar!

</aside>

### Próximo: [Lab 3 - Utilizando mensagens customizadas em ROS 2](Lab%203%20-%20Utilizando%20mensagens%20customizadas%20em%20ROS%202%201ec6e2fe69c480b3af0ff5d9289955d4.md)