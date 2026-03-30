# 1. Introdução a Workspaces e Pacotes de ROS 2

### O que é ROS 2?

<aside>
💡

Pense no ROS 2 ("Robot Operating System") como um "tradutor universal" que conecta diferentes partes de um sistema robótico. Em vez de criar vários programas que precisam conversar diretamente, usamos o ROS 2 para gerenciar toda a comunicação. Ele organiza isso através de:

</aside>

- **📢 Publishers e Subscribers:** Como um grupo no WhatsApp: alguém manda uma mensagem, e todos que estão no grupo recebem.
- **Nó:** é como uma pessoa no grupo - ela pode ser Publisher (escrever no grupo) ou Subscriber (ler a mensagem).
- **Tópico:** é o “nome” do grupo do WhatsApp. É o canal por onde os nós se comunicam
- **Mensagem:** é a estrutura da informação que é enviada. Ex: estrutura de um anúncio da CEE:
    
    <aside>
    <img src="https://www.notion.so/icons/phone-end-call_green.svg" alt="https://www.notion.so/icons/phone-end-call_green.svg" width="40px" />
    
    **[NVidia na SEI]
    Local: Auditório Pompeia**
    
    Horário: 16h
    
    Descrição: evento insano absurdo com coffee break
    
    </aside>
    

![Topic-MultiplePublisherandMultipleSubscriber.gif](1%20Introdu%C3%A7%C3%A3o%20a%20Workspaces%20e%20Pacotes%20de%20ROS%202/Topic-MultiplePublisherandMultipleSubscriber.gif)

---

### Workspace

> Pense no workspace como a mesa de trabalho do seu drone: tudo que você precisa está ali organizado, desde as ferramentas (código) até os parafusos (dependências). Se tudo está no lugar certo, fica fácil montar o drone e fazer ajustes.
> 

O workspace de ROS 2 segue uma estrutura padrão, que inclui os seguintes diretórios principais:

```
ros2_ws/
├── src/
│   ├── PX4-Autopilot/
│   ├── MicroXRCE-Agent/
│   ├── drone_control/
│   │   ├── launch/
│   │   ├── src/
│   │   ├── include/
│   │   ├── CMakeLists.txt
│   │   └── package.xml
│   ├── vision_module/
│   │   ├── launch/
│   │   ├── src/
│   │   ├── include/
│   │   ├── CMakeLists.txt
│   │   └── package.xml
│   └── sensor_fusion/
│       ├── launch/
│       ├── src/
│       ├── include/
│       ├── CMakeLists.txt
│       └── package.xml
├── build/
├── install/
└── log/
```

1. **`src/`:**
    - É onde todo o código-fonte dos pacotes de ROS 2 é armazenado.
    - Aqui você clona repositórios, cria novos pacotes e organiza o desenvolvimento.
    
    > Imagine que o src/ é a gaveta onde você guarda todos os projetos do drone, desde os controles até as câmeras. É onde fica a `main` ou equivalente.
    > 
    
    > Dentro do `src/`, cada pasta tem sua função.
    > 

1. **`include/`:**
    - Diretório opcional que contém arquivos de cabeçalho (headers, .hpp)
    
2. **`build/`:**
    - Diretório onde são gerados os artefatos de compilação.
    - É criado automaticamente após executar `colcon build` e não deve ser editado manualmente.
    
    > O build/ é como a oficina onde o ROS 2 monta as peças do drone. Você não precisa mexer, só deixar ele trabalhar.
    > 
    
3. **`install/`:**
    - Contém os binários e dependências instalados após a compilação.
    
    > O install/ é como o estoque final de peças prontas para uso. Quando você precisa executar algo, é daqui que tudo sai.
    > 
    
4. **`log/`:**
    - Repositório para logs gerados durante execuções e compilações.
    
    > Se algo deu errado, o log/ é o diário do drone que conta o que aconteceu.
    > 

---

### Pacote

Um pacote ROS 2 é a unidade básica de organização no sistema. Ele pode conter nodes, mensagens, serviços, ações, e outros recursos.

> Pense no pacote como uma pasta de projeto autônoma. Ele tem tudo que precisa para funcionar por conta própria e conversar com outros pacotes.
> 

Usar um pacote ROS 2 não é só sobre executar o código; é sobre organizar e distribuir ele de uma forma que faça sentido em **projetos maiores**.

<aside>
<img src="https://www.notion.so/icons/arrow-right-line_purple.svg" alt="https://www.notion.so/icons/arrow-right-line_purple.svg" width="40px" />

Imagine que você tem dois nós: um que controla o drone (`controller_node`) e outro que processa imagens da câmera (`image_processor`).

Esses nós precisam rodar ao mesmo tempo, mas o `controller_node` depende de parâmetros específicos, como o modo de controle, para funcionar corretamente.

*Com um arquivo de launch, você configura tudo isso de forma simples*. Um único comando, `ros2 launch drone_control control_and_vision_launch.py`, inicia os dois nós simultaneamente, com os parâmetros certos para o controlador e o processamento de imagens. Sem isso, você teria que rodar manualmente cada nó, passar os parâmetros no terminal e torcer para não esquecer nada.

</aside>

> Um pacote ROS 2 não é só uma forma de rodar o código. É uma solução completa para organizar, distribuir e operar sistemas complexos de forma profissional e escalável 🚀
> 

Exemplo da estrutura de um pacote:

```
drone_control/
├── launch/
│   └── control_launch.py
├── src/
│   ├── controller_node.cpp
│   └── utils.cpp
├── include/
│   └── drone_control/
│       ├── controller.hpp
│       └── utils.hpp
├── CMakeLists.txt
└── package.xml
```

---

<aside>
⏭️

Próxima aula:

</aside>

### Próximo: [2. Criando o workspace e configurando os submodules](2%20Criando%20o%20workspace%20e%20configurando%20os%20submodules%201ec6e2fe69c480fb85b1c76a94f9ddee.md)