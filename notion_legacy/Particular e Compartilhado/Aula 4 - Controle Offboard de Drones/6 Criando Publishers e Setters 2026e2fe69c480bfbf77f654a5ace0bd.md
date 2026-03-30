# 6. Criando Publishers e Setters

## 1. O que é controle Offboard e como ativar?

<aside>
🌿

Analogia: morro de traficantes

> Imagine que você é um vendedor de drogas comandado por um traficante. Para que você venda drogas, seu chefe tem que garantir duas coisas:
1.A rua não tem nenhum policial→ isso é avisado no grupo de WhatsApp `/policia`
2. Há clientes na rua → isso é avisado no grupo de WhatsApp `/playboys`

Somente quando essas duas condições são satisfeitas, seu chefe traficante te manda vender drogas pelo grupo de Zap `/va_vender_drogas`
> 
</aside>

<aside>
⏭️

A situação é análogo no controle `Offboard`:

O modo `Offboard` só é ativado se estiver recebendo sinal nos tópicos:

1. `/fmu/in/offboard_control_mode`: é um “sinal de vida” de que o PC de bordo está on e conectado certinho na Pixhawk.
2.  `/fmu/in/trajectory_setpoint`: diz para onde o drone deve ir.

Se a conexão cair, o tópico fica sem mensagens suficientes e o drone sai do modo `Offboard`, entrando em um modo de Fallback (geralmente `Position`).

Então, para mudar para `Offboard`, o que acontece é: 

1. Envia dados de `OffboardControlMode` e de `trajectory_setpoint` durante 2 segundos a 10Hz.
2. Envia um comando para mudar de Modo de Voo para `Offboard`.
</aside>

---

## 2. Criando publisher `VehicleCommand` e setters `sendCommand()`, `setOffboardMode()`, `arm()` e `disarm()`

**Criando o publisher de `VehicleCommand.msg`:**

1. Variável privada da classe no `Drone.hpp`:

```cpp
rclcpp::Publisher<px4_msgs::msg::VehicleCommand>::SharedPtr vehicle_command_pub_;
```

1. Definição no `Drone.cpp`:

```cpp
this->vehicle_command_pub_ = this->px4_node_->create_publisher<px4_msgs::msg::VehicleCommand>(
	"/fmu/in/vehicle_command", px4_qos);
```

**Criando o setter de `sendCommand`:**

```cpp
void Drone::sendCommand(
	uint32_t command, uint8_t target_system, uint8_t target_component, uint8_t source_system,
	uint8_t source_component, uint8_t confirmation, bool from_external,
	float param1, float param2, float param3,
	float param4, float param5, float param6,
	float param7)
{
	px4_msgs::msg::VehicleCommand msg;
	msg.timestamp = this->px4_node_->get_clock()->now().nanoseconds() / 1000.0;
	msg.command = command;

	msg.param1 = param1;
	msg.param2 = param2;
	msg.param3 = param3;
	msg.param4 = param4;
	msg.param5 = param5;
	msg.param6 = param6;
	msg.param7 = param7;
	msg.confirmation = confirmation;
	msg.source_system = source_system;
	msg.target_system = target_system;
	msg.target_component = target_component;
	msg.from_external = from_external;
	msg.source_component = source_component;

	this->vehicle_command_pub_->publish(msg);
}
```

**Criando o setter de `setOffboardMode()`:**

```
void Drone::setOffboardMode() {
	this->sendCommand(
		px4_msgs::msg::VehicleCommand::VEHICLE_CMD_DO_SET_MODE,
		this->target_system_,
		this->target_component_,
		this->source_system_,
		this->source_component_,
		this->confirmation_,
		this->from_external_,
		1.0f,
		6.0f
	);
}
```

**Criando o setter de `arm()`:**

```cpp
void Drone::arm() {
    this->sendCommand(
		px4_msgs::msg::VehicleCommand::VEHICLE_CMD_COMPONENT_ARM_DISARM,
		this->target_system_,
		this->target_component_,
		this->source_system_,
		this->source_component_,
		this->confirmation_,
		this->from_external_,
		1.0f
	);
}
```

**Criando o setter de `disarm()`:**

```cpp
void Drone::arm() {
    this->sendCommand(
		px4_msgs::msg::VehicleCommand::VEHICLE_CMD_COMPONENT_ARM_DISARM,
		this->target_system_,
		this->target_component_,
		this->source_system_,
		this->source_component_,
		this->confirmation_,
		this->from_external_,
		0.0f // SÓ MUDA AQUI
	);
}
```

---

## 3. Criando publisher `OffboardControlMode` e setter `setOffboardControlMode()`

```cpp
this->vehicle_offboard_control_mode_pub_ = this->px4_node_->create_publisher<px4_msgs::msg::OffboardControlMode>(
	"/fmu/in/offboard_control_mode", px4_qos);
```

```cpp
void Drone::setOffboardControlMode(DronePX4::CONTROLLER_TYPE type) {
	px4_msgs::msg::OffboardControlMode msg;
	msg.timestamp = this->px4_node_->get_clock()->now().nanoseconds() / 1000;

	msg.position = false;
	msg.velocity = false;
	msg.acceleration = false;
	msg.attitude = false;
	msg.body_rate = false;
	msg.direct_actuator = false;

	if (type == DronePX4::CONTROLLER_TYPE::POSITION) {
		msg.position = true;
	} else if (type == DronePX4::CONTROLLER_TYPE::VELOCITY) {
		msg.velocity = true;
	} else if (type == DronePX4::CONTROLLER_TYPE::BODY_RATES) {
		msg.body_rate = true;
	} else {
		RCLCPP_WARN(this->px4_node_->get_logger(), "No controller is defined");
	}

	this->vehicle_offboard_control_mode_pub_->publish(msg);
}
```

---

## 4. Criando publisher `TrajectorySetpoint` e setter `setLocalPosition()`

```cpp
this->vehicle_trajectory_setpoint_pub_ = this->px4_node_->create_publisher<px4_msgs::msg::TrajectorySetpoint>(
	"/fmu/in/trajectory_setpoint", px4_qos);
```

```cpp
void Drone::setLocalPosition(float x, float y, float z, float yaw) {
	this->setOffboardControlMode(DronePX4::CONTROLLER_TYPE::POSITION);

	px4_msgs::msg::TrajectorySetpoint msg;

	msg.timestamp = this->px4_node_->get_clock()->now().nanoseconds() / 1000;

	msg.position[0] = x;
	msg.position[1] = y;
	msg.position[2] = z;
	msg.yaw = yaw;

	// Set velocity setpoints to NaN (not used for position control)
	msg.velocity[0] = std::numeric_limits<float>::quiet_NaN();
	msg.velocity[1] = std::numeric_limits<float>::quiet_NaN();
	msg.velocity[2] = std::numeric_limits<float>::quiet_NaN();
	msg.yawspeed = std::numeric_limits<float>::quiet_NaN();

	msg.acceleration[0] = std::numeric_limits<float>::quiet_NaN();
	msg.acceleration[1] = std::numeric_limits<float>::quiet_NaN();
	msg.acceleration[2] = std::numeric_limits<float>::quiet_NaN();

	this->vehicle_trajectory_setpoint_pub_->publish(msg);
}
```

---

## 5. Finalmente, mudando para modo `Offboard`

```cpp
void Drone::toOffboardSync() {
	// Send position setpoints for a short time before switching to offboard mode
	for (int i = 0; i < 20; i++) {
		setLocalPosition(
			current_pos_x_,
			current_pos_y_,
			current_pos_z_,
			std::numeric_limits<float>::quiet_NaN());
		setOffboardControlMode(DronePX4::CONTROLLER_TYPE::POSITION);
		rclcpp::sleep_for(std::chrono::milliseconds(100));
	}
	setOffboardMode();
}
```

---

## 6. Testando a implementação

1. Buildar o projeto:
    
    ```bash
    cd ~/drone_ws
    colcon build
    ```
    

1. Executar a FSM de teste:
    
    ```bash
    source install/setup.bash
    ros2 run drone_control goto
    ```
    

---

<aside>
💪🏻

Hora de praticar!!

</aside>

### Próximo: [Lab 6 - Getters e Setters](Lab%206%20-%20Getters%20e%20Setters%2016f6e2fe69c480b8b259ce18524719a2.md)