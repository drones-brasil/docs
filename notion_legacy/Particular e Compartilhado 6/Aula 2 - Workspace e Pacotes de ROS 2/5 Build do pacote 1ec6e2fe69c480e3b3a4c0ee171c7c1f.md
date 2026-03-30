# 5. Build do pacote

## 1. Como Buildar um Workspace

1. **Compilar o Workspace:**
    - Navegue até o diretório raiz do workspace (onde o `src/` está localizado):
        
        ```bash
        cd ~/ros2_ws
        ```
        
    - Execute o comando de build:
        
        ```bash
        colcon build
        ```
        
2. **Dar Source no Ambiente:**
    - Após o build, você precisa dar source no ambiente para que o ROS 2 reconheça os pacotes recém-compilados:
        
        ```bash
        source install/setup.bash
        ```
        

> Se não fizer isso, o ROS 2 não encontrará os pacotes no workspace. Esse script diz ao shell (linguagem do terminal) onde estão os arquivos do nosso pacote.
> 

---

## 2. O que Acontece Durante o Build

O comando `colcon build` realiza diversas etapas para transformar o código-fonte em arquivos executáveis e configurados para execução. O que acontece:

1. **Diretório `build/`:**
    - Este diretório contém os artefatos intermediários gerados pelo processo de compilação. Alguns exemplos:
        - Arquivos temporários de configuração do CMake.
        - Objetos compilados (`.o`) antes de serem vinculados em executáveis.
        - Logs detalhados do processo de build.
    
2. **Diretório `install/`:**
    - Este diretório contém os arquivos prontos para uso pelo ROS 2. É aqui que ficam os binários, bibliotecas e arquivos de configuração. Exemplos:
        - `setup.bash`: Script para configurar o ambiente e localizar os pacotes.
        - `lib/<nome_do_pacote>/`: Diretório contendo os executáveis prontos para rodar com `ros2 run`.
        - `share/<nome_do_pacote>/`: Arquivos como `package.xml` e scripts de lançamento.
        
3. **Uso desses Arquivos na Execução:**
    - Quando você executa um comando como `ros2 run`, o ROS 2 procura pelos executáveis no diretório `install/lib/<nome_do_pacote>/`.
    - Os tópicos e serviços que você define no código também são registrados no ambiente através do `install/setup.bash`.

---

## 3. Symlink-Install

Durante o build, você pode usar a opção `--symlink-install` para criar links simbólicos no diretório de instalação. Isso permite que alterações no código-fonte sejam refletidas imediatamente sem a necessidade de reconstruir o pacote:

```bash
colcon build --symlink-install
```

<aside>
🐵

`--symlink-install` cria atalhos (symlinks) que apontam diretamente para o código-fonte em vez de copiar os arquivos para o diretório `install`. Assim, qualquer modificação no código é refletida instantaneamente ao executar o pacote. 

</aside>

> Usar o symlink-install é ótimo para desenvolvimento, porque te poupa o tempo que o computador leva para copiar os arquivos para a pasta `install`. Mas, para produção, ter arquivos estáveis e isolados é mais seguro.
> 

---

<aside>
⏭️

Próxima aula:

</aside>

### Próximo: [6. Gerindo dependências com rosdep](6%20Gerindo%20depend%C3%AAncias%20com%20rosdep%201ec6e2fe69c480f59189f72ce1701b65.md)