# 1. Introdução - PX4 Autopilot

## 1. PX4 Autopilot

![image.png](1%20Introdu%C3%A7%C3%A3o%20-%20PX4%20Autopilot/a5e56a62-543b-432f-8a13-ade7e653c6b0.png)

### O que é o PX4

<aside>
🔥

O **PX4 Autopilot** é um firmware open-source. Funciona como o "sistema operacional" do drone. Ele realiza:

- Controle de estabilidade e atitude do drone
- Fusão de dados de sensores (IMU, GPS, barômetro)
- Execução de modos de voo (manual, automático, offboard)
- Interface com sistemas externos via MAVLink e MicroXRCE-DDS
</aside>

### Onde o PX4 Executa

O PX4 roda em diferentes sistemas operacionais dependendo do hardware:

**NuttX (Microcontroladores):**  Pixhawk

- Sistema operacional real-time, otimizado para baixo consumo

**Simulação:**

- **SITL (Software-in-the-Loop)**: Executa nativamente no Linux para desenvolvimento

---

## 2. Máquina de Estados (FSM) vs Classe Drone

| Componente | O que faz | Exemplo |
| --- | --- | --- |
| **PX4 Firmware** | Controle de baixo nível | Estabilização, controle de motores |
| **Classe Drone** | Interface de comunicação | `armSync()`, `getLocalPosition()` |
| **FSM** | Lógica de missão | Sequência takeoff → navigate → land |
| **Estados** | Comportamentos específicos | Algoritmo de pouso suave |

<aside>
💡

A classe Drone lida com tudo relacionado ao ROS2 (Subscribers, Publishers) e ao PX4 (ações do drone, pense nos tópicos `/fmu/in` e `/fmu/out` .

---

A máquina de estados faz a lógica de voo em si. Cada estado tem um comportamento.

</aside>

![image.png](1%20Introdu%C3%A7%C3%A3o%20-%20PX4%20Autopilot/image.png)

<aside>
⏭️

Próxima seção:

</aside>

### Próximo: [2. Configurando o Workspace](2%20Configurando%20o%20Workspace%2016f6e2fe69c480f49d72f1a14bbcebea.md)