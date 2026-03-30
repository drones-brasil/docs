# Lab 6 - Getters e Setters

<aside>
<img src="https://www.notion.so/icons/code_purple.svg" alt="https://www.notion.so/icons/code_purple.svg" width="40px" />

Sua tarefa é escrever algumas funções que expandam a funcionalidade da nossa classe Drone.

</aside>

## 1. Getter de Velocidade

1. Implemente uma nova função na classe Drone entitulada `getLocalVelocity` que retorne as 3 velocidades de translação - `vx`, `vy`, `vz`.
    
    <aside>
    ⚠️
    
    LEMBRANDO:
    
    `Drone.hpp`: definição da função
    
    `Drone.cpp`: declaração da função
    
    </aside>
    
2. Use essa função na função `act` do estado `test_getter_state.hpp` para testar se está funcionando da maneira correta.
3. Builde novamente o pacote e rode o executável `test_getter_state`.

- Gabarito
    1. Getter
    
    ```cpp
    // NO ARQUIVO DRONE.HPP, DENTRO DO PUBLIC
    Eigen::Vector3d getLocalVelocity();
    ```
    
    ```cpp
    // NO ARQUIVO DRONE.CPP, EM QUALQUER LUGAR APOS OS INCLUDES
    Eigen::Vector3d Drone::getLocalVelocity() {
    	return Eigen::Vector3d({
    		this->current_vel_x_,
    		this->current_vel_y_,
    		this->current_vel_z_
    	});
    }
    ```
    
    b. Teste na `act()` do `test_getter_state.hpp`:
    
    ```cpp
    class LandingState : public fsm::State {
    public:
        LandingState() : fsm::State() {}
    
        void on_enter(fsm::Blackboard &blackboard) override {
            drone = blackboard.get<Drone>("drone");
            if (drone == nullptr) return;
            drone->log("STATE: LANDING");
    
            pos = drone->getLocalPosition();
    
            start_time_ = std::chrono::steady_clock::now();
    
            drone->log("Descending for 8s.");
        }
        std::string act(fsm::Blackboard &blackboard) override {
            (void) blackboard;
            
            auto current_time = std::chrono::steady_clock::now();
            auto elapsed_time = std::chrono::duration_cast<std::chrono::seconds>(current_time - start_time_).count();
    
            if (elapsed_time > 8) {
                return "LANDED";
            }
    
            drone->setLocalVelocity(0.0, 0.0, 0.5, 0.0);
            return "";
        }
    
        void on_exit(fsm::Blackboard &blackboard) override {
            (void) blackboard;
    
            drone->log("Disarming.");
            drone->disarmSync();
        }
    
    private:
        Drone* drone;
        Eigen::Vector3d pos;
        std::chrono::steady_clock::time_point start_time_;
    };
    ```
    
    c. Para buildar e rodar:
    
    ```bash
    cd ~/drone_ws
    colcon build
    ```
    
    ```bash
    source install/setup.bash
    ros2 run drone_control test_getter_state
    ```
    

---

## 2. Setter de Velocidade

1. Implemente uma nova função, chamada de `SetLocalVelocity`, que tenha como argumento `(float vx, float vy, float vz, float yaw)` e publique uma mensagem de `TrajectorySetpoint` dessas velocidades.
2. Use essa função na função `act()` do estado `landing_state.hpp` para testar se o setter está funcionando corretamente.
3. Builde novamente o pacote e rode o executável `goto`.

<aside>
⚠️

LEMBRANDO:

`Drone.hpp`: definição da função

`Drone.cpp`: declaração da função

</aside>

- Gabarito
    1. Getter
    
    ```cpp
    // NO ARQUIVO DRONE.HPP, DENTRO DO PUBLIC
    void setLocalVelocity(float vx, float vy, float vz, float yaw_rate = 0.0f);
    ```
    
    ```cpp
    // NO ARQUIVO DRONE.CPP, EM QUALQUER LUGAR APOS OS INCLUDES
    void Drone::setLocalVelocity(float vx, float vy, float vz, float yaw_rate) {
    	this->setOffboardControlMode(DronePX4::CONTROLLER_TYPE::VELOCITY);
    	
    	px4_msgs::msg::TrajectorySetpoint msg;
    
    	msg.timestamp = this->px4_node_->get_clock()->now().nanoseconds() / 1000;
    
    	msg.position[0] = std::numeric_limits<float>::quiet_NaN();
    	msg.position[1] = std::numeric_limits<float>::quiet_NaN();
    	msg.position[2] = std::numeric_limits<float>::quiet_NaN();
    	msg.yaw = std::numeric_limits<float>::quiet_NaN();
    
    	msg.velocity[0] = vx;
    	msg.velocity[1] = vy;
    	msg.velocity[2] = vz;
    	msg.yawspeed = yaw_rate;
    
    	msg.acceleration[0] = std::numeric_limits<float>::quiet_NaN();
    	msg.acceleration[1] = std::numeric_limits<float>::quiet_NaN();
    	msg.acceleration[2] = std::numeric_limits<float>::quiet_NaN();
    
    	this->vehicle_trajectory_setpoint_pub_->publish(msg);
    }
    ```
    
    b. Teste na `act()` do `landing_state.hpp`:
    
    ```cpp
        std::string act(fsm::Blackboard &blackboard) override {
            (void) blackboard;
            
            auto current_time = std::chrono::steady_clock::now();
            auto elapsed_time = std::chrono::duration_cast<std::chrono::seconds>(current_time - start_time_).count();
    
            if (elapsed_time > 8) {
                return "LANDED";
            }
    
            drone->setLocalVelocity(0.0, 0.0, 0.5, 0.0);
            return "";
        }
    ```
    
    c. Para buildar e rodar:
    
    ```bash
    cd ~/drone_ws
    colcon build
    ```
    
    ```bash
    source install/setup.bash
    ros2 run drone_control goto
    ```
    

---

## 3. armSync() e disarmSync()

1. Implemente uma função chamada `armSync()` que envie comandos para armar a 10Hz até que o Drone esteja armado.
    
    O estado de armado é `DronePX4::ARMING_STATE::ARMED` 
    
    O comando para “dormir” é: `rclcpp::sleep_for(std::chrono::milliseconds(<VALOR>))`
    
2. Implemente uma função chamada `disarmSync()` que envie comandos para desarmar a 10Hz até que o Drone esteja desarmado.
    
    O estado de desarmado é `DronePX4::ARMING_STATE::DISARMED` 
    
3. Use a `armSync()` na função `on_enter` do `takeoff_state.hpp`
4. Use a função `disarmSync()` na função `on_exit` do `landing_state.hpp`
5. Builde novamente o pacote e rode o executável `takeoff_land`

<aside>
⚠️

LEMBRANDO:

`Drone.hpp`: definição da função

`Drone.cpp`: declaração da função

</aside>

- Gabarito
    1. Getter
    
    ```cpp
    // NO ARQUIVO DRONE.HPP, DENTRO DO PUBLIC
    	void armSync();
    	void disarmSync();
    ```
    
    ```cpp
    // NO ARQUIVO DRONE.CPP, EM QUALQUER LUGAR APOS OS INCLUDES
    void Drone::armSync() {
    	while (getArmingState() != DronePX4::ARMING_STATE::ARMED && rclcpp::ok()) {
    		this->arm();
    		rclcpp::sleep_for(std::chrono::milliseconds(100));
    	}
    }
    
    void Drone::disarmSync() {
    	while (getArmingState() != DronePX4::ARMING_STATE::DISARMED && rclcpp::ok()) {
    		this->disarm();
    		rclcpp::sleep_for(std::chrono::milliseconds(100));
    	}
    }
    ```
    
    b. Teste na `on_enter()` do `takeoff_state.hpp`:
    
    ```cpp
    drone->toOffboardSync();
    drone->armSync();
    ```
    
    c. Teste na função `on_exit()` do `landing_state.hpp`:
    
    ```cpp
        void on_exit(fsm::Blackboard &blackboard) override {
            (void) blackboard;
    
            drone->log("Disarming.");
            drone->disarmSync();
        }
    ```
    
    c. Para buildar e rodar:
    
    ```bash
    cd ~/drone_ws
    colcon build
    ```
    
    ```bash
    source install/setup.bash
    ros2 run drone_control takeoff_landing
    ```
    

---

<aside>
💪🏻

Mandou bem!!

</aside>

### Voltar ao menu: [Navegação Autônoma](https://www.notion.so/Navega-o-Aut-noma-1586e2fe69c480a7b68cf652af2d931d?pvs=21)