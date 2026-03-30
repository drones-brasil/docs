# 1. Introdução: Máquina de Estados

## 1. O que é uma FSM

As Máquinas de Estados Finitos (FSM - Finite State Machines) são um modelo matemático usado para descrever sistemas que podem estar em apenas um estado por vez, mudando de estado com base em eventos ou condições predefinidas. Uma FSM é composta por:

- **Estado**: Representa uma condição ou situação atual do sistema.
- **Transição**: Mudança de um estado para outro, ativada por um evento.
- **Evento**: Acontecimento ou condição que dispara uma transição.

---

## 2. State: on_enter, act & on_exit

Cada estado em uma FSM possui três métodos principais:

- **on_enter**: Executado quando o estado é ativado.
- **act**: Executado continuamente enquanto o estado está ativo.
- **on_exit**: Executado ao sair do estado.

**Exemplo: Estado de Decolagem (C++):**

```cpp
class TakeoffState : public State {
public:
    void on_enter() override {
        std::cout << "Iniciando decolagem..." << std::endl;
        }

    void act() override {
        std::cout << "Atingindo altura desejada..." << std::endl;
        
        if (chegou_na_altura){
		        coordenada_base = coordenada_entrada;
	          mudarEstado()
	      }    
	      
    }

    void on_exit() override {
        std::cout << "Decolagem concluída." << std::endl;
    }
};

class GoToBase

```

---

## 3. Trabalhando com Blackboard

O Blackboard é uma estrutura para compartilhar informações entre estados de uma FSM.

### Benefícios:

- Reduz dependência entre estados.
- Permite comunicação centralizada.

### Exemplo de Uso:

No exemplo de um drone:

- **Estado "TakeoffState"**: Escreve a coordenada da base a ser visitada.
- **Estado "GoToBaseState"**: Usa a coordenada para chegar  à base.

```cpp
// TakeoffState
Eigen::Vector3d coordenada_base{2.0, 0.0, -0.5} // x=2m, y=0m, z=-0,5m
blackboard.set<Eigen::Vector3d>("coordenada da base", coordenada_base);

// GoToBaseState

Eigen::Vector3d coordenada_base = *blackboard.get<Eigen::Vector3d>("coordenada da base");

// Foi usado * aqui porque blackboard.get retorna o ponteiro para a variável
```

---

<aside>
⏭️

Próxima seção da aula:

</aside>

### Próximo: [2. Configurando o workspace](2%20Configurando%20o%20workspace%2016c6e2fe69c4804c8b66e40507dbe1fa.md)