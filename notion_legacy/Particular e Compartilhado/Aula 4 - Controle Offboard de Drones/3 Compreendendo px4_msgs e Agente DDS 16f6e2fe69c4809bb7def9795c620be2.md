# 3. Compreendendo px4_msgs e Agente DDS

## 1. O que é o pacote `px4_msgs`

<aside>
✈️

O pacote `px4_msgs` contém as definições de mensagens ROS 2 do PX4 Autopilot. Cada mensagem corresponde a um tipo específico de dados que o PX4 pode enviar ou receber.

As mensagens px4_msgs seguem a especificação uORB (Micro Object Request Broker) do PX4 

</aside>

Vamos verificar quais tópicos existem no nosso workspace sem nada rodando:

```bash
cd ~/drone_ws
source install/setup.bash
ros2 topic list
```

> Resultado: 
`/parameter_events
/rosout`
> 

Existe um comando de ros2, chamado de `ros2 interface show`, que permite verificar quais campos tem uma mensagem.

```bash

source install/setup.bash
ros2 interface show px4_msgs/msg/VehicleOdometry
```

<aside>
⚠️

OBS: A interface só vai funcionar se a mensagem que você está tentando mostrar, nesse caso a `VehicleOdometry.msg`, tiver sido buildada no seu workspace.

</aside>

**Exemplo - VehicleOdometry.msg**

> Resultado:
> 
> 
> ```bash
> # Odometria do veículo com dados de posição e velocidade
> uint64 timestamp                # Timestamp em microssegundos
> uint8 pose_frame               # Frame de referência (NED, FRD)
> float32[3] position            # Posição [x, y, z] em metros
> float32[4] q                   # Quaternion de orientação [w, x, y, z]
> uint8 velocity_frame           # Frame de velocidade
> float32[3] velocity            # Velocidade [vx, vy, vz] em m/s
> float32[3] angular_velocity    # Velocidade angular em rad/s
> ```
> 

---

## 2. Agente MicroXRCE-DDS

### O que é o MicroXRCE-DDS

O **MicroXRCE-DDS** é um protocolo de comunicação leve que implementa o padrão DDS (Data Distribution Service). É a ponte entre o PX4 e o ROS 2.

![image.png](3%20Compreendendo%20px4_msgs%20e%20Agente%20DDS/image.png)

- O cliente roda no PX4 (Pixhawk)
- O agente roda no computador de bordo (Jetson / Raspberry Pi)
- A conexão é por `serial` (USB ou UART) ou por `UDP` (Ethernet)

**Executar o Agente:**

```bash
# Conectar via UDP (padrão para simulação)
micro-xrce-dds-agent udp4 -p 8888
```

Após iniciar o agente, verifique os tópicos disponíveis:

```bash
# Terminal 2: Verificar tópicos com agente ativo
ros2 topic list

# Resultado: Tópicos PX4 disponíveis
/fmu/in/obstacle_distance
/fmu/in/offboard_control_mode
/fmu/in/onboard_computer_status
/fmu/in/trajectory_setpoint
/fmu/in/vehicle_command
/fmu/in/vehicle_mocap_odometry
/fmu/in/vehicle_trajectory_bezier
/fmu/in/vehicle_trajectory_waypoint
/fmu/in/vehicle_visual_odometry
/fmu/out/failsafe_flags
/fmu/out/sensor_combined
/fmu/out/timesync_status
/fmu/out/vehicle_attitude
/fmu/out/vehicle_control_mode
/fmu/out/vehicle_global_position
/fmu/out/vehicle_gps_position
/fmu/out/vehicle_land_detected
/fmu/out/vehicle_local_position
/fmu/out/vehicle_odometry
/fmu/out/vehicle_status
```

- `/fmu/in/`: Tópicos para enviar comandos **para** o PX4
- `/fmu/out/`: Tópicos que recebem dados **do** PX4

Uma alternativa é usar o rqt para visualizar os tópicos:

```bash
source ~/drone_ws/install/setup.bash
rqt
```

Navegar para: Plugins → Topics → Topic Monitor

---

## 3. MicroXRCE-DDS vs MAVLink

<aside>
📡

- Protocolo binário otimizado para links de baixa largura de banda
- Usado tradicionalmente em Ground Control Stations (QGroundControl, Mission Planner)
- Requer bibliotecas específicas (pymavlink, MAVSDK)
- Limitado aos comandos e telemetria predefinidos no padrão MAVLink
</aside>

---

<aside>
⏭️

Próxima seção:

</aside>

### Próximo: [4. Criando a classe Drone](4%20Criando%20a%20classe%20Drone%2016f6e2fe69c480088982c82fb8747fc9.md)