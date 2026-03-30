# 5. Implementando GoTo

## 1. Criando os arquivos

1. Dentro de `src/simple_fsm/drone_control/src`, crie o arquivo goto.cpp:

```cpp
#include "fsm/fsm.hpp"

#include "takeoff_state.hpp"
#include "landing_state.hpp"
#include "goto_state.hpp"

#include <rclcpp/rclcpp.hpp>
#include <memory>
#include <iostream>

class GoToFSM : public fsm::FSM {
public:
    GoToFSM() : fsm::FSM({"ERROR", "FINISHED"}) {

        this->blackboard_set<Drone>("drone", new Drone());

        float takeoff_height = -2.5;
        this->blackboard_set<float>("takeoff_height", takeoff_height);

        Eigen::Vector3d target_base(2.0, -2.0, 0.0);
        this->blackboard_set<Eigen::Vector3d>("target_base", target_base);

        // Adding states
        this->add_state("TAKEOFF", std::make_unique<TakeoffState>());
        this->add_state("LANDING", std::make_unique<LandingState>());
        this->add_state("GOTO", std::make_unique<GoToState>());

        // Initial Takeoff transitions
        this->add_transitions("TAKEOFF", {{"TAKEOFF COMPLETED", "GOTO"},{"SEG FAULT", "ERROR"}});

        // GoTo transitions
        this->add_transitions("GOTO", {{"ARRIVED AT POINT", "LANDING"},{"SEG FAULT", "ERROR"}});

        // Landing transitions
        this->add_transitions("LANDING", {{"LANDED", "FINISHED"},{"SEG FAULT", "ERROR"}});
        
    }
};

class NodeFSM : public rclcpp::Node {
public:
    NodeFSM() : rclcpp::Node("goto_node"), my_fsm() {
        timer_ = this->create_wall_timer(
            std::chrono::milliseconds(50),  // Run at approximately 20 Hz
            std::bind(&NodeFSM::executeFSM, this));
    }

    void executeFSM() {
        if (rclcpp::ok() && !my_fsm.is_finished()) {
            my_fsm.execute();
        } else {
            rclcpp::shutdown();
        }
    }

private:
    GoToFSM my_fsm;
    rclcpp::TimerBase::SharedPtr timer_;
};

int main(int argc, const char *argv[]) {
    rclcpp::init(argc, argv);

    auto my_node = std::make_shared<NodeFSM>();
    rclcpp::spin(my_node);

    return 0;
}

```

1. Dentro de `src/simple_fsm/drone_control/include`, crie o arquivo goto_state.hpp:

```cpp
#include <Eigen/Eigen>
#include "fsm/fsm.hpp"
#include "drone/Drone.hpp"

class GoToState : public fsm::State {
public:
    GoToState() : fsm::State() {}

    void on_enter(fsm::Blackboard &blackboard) override {

        drone = blackboard.get<Drone>("drone");
        if (drone == nullptr) return;
        drone->log("STATE: GoToState");

        Eigen::Vector3d target_base = *blackboard.get<Eigen::Vector3d>("target_base");
        float takeoff_height = *blackboard.get<float>("takeoff_height");

        goal = Eigen::Vector3d({target_base.x(), target_base.y(), takeoff_height});
        yaw = drone->getOrientation()[2];

        max_velocity = 0.8;
    }

    std::string act(fsm::Blackboard &blackboard) override {
        (void)blackboard;
        pos = drone->getLocalPosition();

        if ((pos-goal).norm() < 0.08) {
            return "ARRIVED AT POINT";
        }
        
        Eigen::Vector3d diff = goal - pos;
        Eigen::Vector3d little_goal = pos + (diff.norm() > max_velocity ? diff.normalized() * max_velocity : diff);

        drone->setLocalPosition(little_goal[0], little_goal[1], little_goal[2], yaw);

        return "";
    }

    void on_exit(fsm::Blackboard &blackboard) override {
        (void)blackboard;
    }

private:
    Eigen::Vector3d pos, goal;
    Drone* drone;
    double max_velocity; // m/s
    float yaw;
};
```

---

<aside>
⏭️

Parabéns, você concluiu a Aula 3!!

Agora é hora de praticar, adicionando mais dois estados.

</aside>

### Próximo: [Lab 5 - GoTo múltiplas bases](Lab%205%20-%20GoTo%20m%C3%BAltiplas%20bases%2016c6e2fe69c480128534d6dc6d510d44.md)