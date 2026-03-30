# 5. Criando Subscribers e Getters

## 1. Quality of Service (QoS) do PX4

PX4 usa o seguinte QoS para Publisher:

```cpp
uxrQoS_t qos = {
.durability = UXR_DURABILITY_TRANSIENT_LOCAL,
.reliability = UXR_RELIABILITY_BEST_EFFORT,
.history = UXR_HISTORY_KEEP_LAST,
.depth = 0,
};
```

PX4 usa o seguinte QoS para Subscriber:

```cpp
uxrQoS_t qos = {
.durability = UXR_DURABILITY_VOLATILE,
.reliability = UXR_RELIABILITY_BEST_EFFORT,
.history = UXR_HISTORY_KEEP_LAST,
.depth = queue_depth,
};
```

Vamos utilizar o seguinte QoS:

```cpp
	// Configure QoS for PX4 communication
	rclcpp::QoS px4_qos(5);
	px4_qos.best_effort();
	px4_qos.durability(rclcpp::DurabilityPolicy::TransientLocal);

	// QoS for custom messages
	rclcpp::QoS custom_qos(10);
```

---

## 2. Subscriber de Odometria e getters

**Criando o subscriber de `VechicleOdometry.msg`:**

1. Variável privada da classe no `Drone.hpp`:

```cpp
rclcpp::Subscription<px4_msgs::msg::VehicleOdometry>::SharedPtr vehicle_odometry_sub_;
```

1. Definição no `Drone.cpp`:

```cpp
// Subscribe to vehicle odometry
this->vehicle_odometry_sub_ = this->px4_node_->create_subscription<px4_msgs::msg::VehicleOdometry>(
	"/fmu/out/vehicle_odometry",
	px4_qos,
	[this](px4_msgs::msg::VehicleOdometry::ConstSharedPtr msg) {
		this->odom_timestamp_ = std::chrono::time_point<std::chrono::high_resolution_clock>(
			std::chrono::nanoseconds(msg->timestamp));
		
		// Update position and velocity
		this->current_pos_x_ = msg->position[0];
		this->current_pos_y_ = msg->position[1];
		this->current_pos_z_ = msg->position[2];
		this->current_vel_x_ = msg->velocity[0];
		this->current_vel_y_ = msg->velocity[1];
		this->current_vel_z_ = msg->velocity[2];
		
		// Calculate ground speed
		this->ground_speed_ = std::sqrt(
			std::pow(msg->velocity[0], 2) + std::pow(msg->velocity[1], 2));

		// Extract orientation from quaternion if valid
		if (!std::isnan(msg->q[0])) {
			double yaw = 0, pitch = 0, roll = 0;
			// PX4 uses WXYZ, TF2 uses XYZW
			tf2::getEulerYPR(
				tf2::Quaternion(msg->q[1], msg->q[2], msg->q[3], msg->q[0]),
				yaw, pitch, roll
			);
			this->yaw_ = static_cast<float>(yaw);
			this->pitch_ = static_cast<float>(pitch);
			this->roll_ = static_cast<float>(roll);
		}
	}
);
```

**Criando os getters de Odometria (funções `public`):**

```cpp
Eigen::Vector3d Drone::getLocalPosition() {
	return Eigen::Vector3d({
		this->current_pos_x_,
		this->current_pos_y_,
		this->current_pos_z_
	});
}

Eigen::Vector3d Drone::getOrientation() {
	return Eigen::Vector3d({
		this->roll_,
		this->pitch_,
		this->yaw_
	});
}

float Drone::getGroundSpeed() {
	return this->ground_speed_;
}
```

---

## 3. Subscriber de Status e getters

**Criando os `enum` de ArmingState:**

```cpp
namespace DronePX4
{
enum ARMING_STATE
{
	DISARMED = 1,
	ARMED = 2
};

enum CONTROLLER_TYPE
{
  	NO_CONTROLLER = 0,        // No controller defined
  	POSITION = 1,             // Position control
  	VELOCITY = 2,             // Velocity control
  	BODY_RATES = 3,           // Body rates (rad/s) and thrust [-1, 1] controller
};
}
```

**Criando o subscriber de `VechicleStatus.msg`:**

1. Variável privada da classe no `Drone.hpp`:

```cpp
DronePX4::ARMING_STATE arming_state_{DronePX4::ARMING_STATE::DISARMED};
rclcpp::Subscription<px4_msgs::msg::VehicleStatus>::SharedPtr vehicle_status_sub_;

```

1. Definição no `Drone.cpp`:

```cpp
// Subscribe to vehicle status
this->vehicle_status_sub_ = this->px4_node_->create_subscription<px4_msgs::msg::VehicleStatus>(
	"/fmu/out/vehicle_status",
	px4_qos,
	[this](px4_msgs::msg::VehicleStatus::ConstSharedPtr msg) {
		switch (msg->arming_state) {
			case px4_msgs::msg::VehicleStatus::ARMING_STATE_ARMED:
				this->arming_state_ = DronePX4::ARMING_STATE::ARMED;
				break;
			case px4_msgs::msg::VehicleStatus::ARMING_STATE_DISARMED:
				this->arming_state_ = DronePX4::ARMING_STATE::DISARMED;
				break;
			default:
				this->arming_state_ = DronePX4::ARMING_STATE::DISARMED;
				break;
		}
	}
);
```

**Criando os getters de ArmingState (função `public`):**

```cpp
DronePX4::ARMING_STATE Drone::getArmingState() {
	return this->arming_state_;
}
```

<aside>
⏭️

### Por quê usar os `enum`?

</aside>

Suponha que nós tivéssemos declarado o arming_state_ como uma string:

```cpp
class Drone {
private:
    std::string arming_state_{"DISARMED"};  // String em vez de enum
};

// Uso
if (arming_state_ == "ARMED") {
    // fazer algo
}

// No callback
this->arming_state_ = "ARMED";  // Atribui string

```

1. **Sem Type Safety** (Principal problema)

```cpp
// Com enum - ERRO DE COMPILAÇÃO ✅
arming_state_ = DronePX4::FLYING;  // ❌ Erro! FLYING não existe

// Com string - ERRO EM RUNTIME ❌
arming_state_ = "FLING";  // ❌ Typo! Só descobrirá rodando
arming_state_ = "armed";  // ❌ Minúscula! Bug silencioso
```

2. **Performance Pior**

```cpp
// Enum - Comparação de inteiros (rápido)
if (state == DronePX4::ARMED) { }  // Compara 2 == 2

// String - Comparação de caracteres (lento)
if (state == "ARMED") { }  // Compara 'A'=='A', 'R'=='R', etc.
```

3. **Uso de Memória**

```cpp
// Enum - 4 bytes (int)
DronePX4::ARMING_STATE state = ARMED;  // 4 bytes

// String - Muito mais memória
std::string state = "ARMED";  // 5 chars + overhead = ~20+ bytes
```

4. **Sem Autocompletar**

```cpp
// Enum - IDE ajuda
state = DronePX4::  // ← IDE mostra ARMED, DISARMED

// String - Sem ajuda
state = "ARM";  // ← Você precisa lembrar se é "ARMED" ou "ARM"
```

---

## 4. Testando a implementação

1. Buildar o projeto:
    
    ```bash
    cd ~/drone_ws
    colcon build
    ```
    

1. Executar a FSM de teste:
    
    ```bash
    source install/setup.bash
    ros2 run drone_control test_getters
    ```
    

---

<aside>
⏭️

Próxima seção:

</aside>

### Próximo: [6. Criando Publishers e Setters](6%20Criando%20Publishers%20e%20Setters%202026e2fe69c480bfbf77f654a5ace0bd.md)