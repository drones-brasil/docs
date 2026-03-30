# 3. Controlando o drone por FSM

## 1. Rodando a simulação

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

## 2. Verificando a estrutura de px4_msgs no ROS 2

Nós também podemos ver as informações de px4 que estão sendo publicadas em ROS 2.

Para ver todos os tópicos, rode no terminal:

```bash
source install/setup.bash
ros2 topic list
```

Isso deve ter mostrado uma lista com todos os tópicos disponíveis. Há dois grupos:

- `/fmu/in/...` : são os tópicos em que o PX4 se inscreve (input da controladora). É aqui que os comandos para o drone vão, por exemplo.
- `/fmu/out/...`: são os tópicos publicados pelo PX4 (output da controladora). Encontramos informações como status do drone, posição, leituras da IMU, …

Para visualizar qualquer um dos tópicos e ver o que a PX4 está publicando, você pode fazer:

```bash
ros2 topic echo /fmu/out/vehicle_local_position
```

---

## 3. Rodando os pacotes

Agora vamos controlar o dronne em OffboardControl. Na aba do vscode aberto no `drone_ws`, rode no terminal:

```bash
source install/setup.bash
ros2 run drone_control takeoff_landing
```

---

<aside>
⏭️

Próxima seção da aula:

</aside>

### Próximo: [4. Implementando Takeoff & Landing](4%20Implementando%20Takeoff%20&%20Landing%201f46e2fe69c48010af43c8d0ece9f185.md)