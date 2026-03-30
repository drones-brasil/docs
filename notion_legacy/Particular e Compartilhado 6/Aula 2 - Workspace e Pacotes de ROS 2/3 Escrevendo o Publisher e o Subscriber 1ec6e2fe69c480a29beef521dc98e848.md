# 3. Escrevendo o Publisher e o Subscriber

## 1. Mudar para a branch `implementar`

```bash
cd ~/evtol_ws/src/simple_pubsub
git checkout implementar
```

## 2. Completar o Publisher e o Subscriber

1. **Publisher:**
- Inicializacao do no
- Usar a `create_publisher`
- Implementar a `timer_callback`
- Criar o no e chamar a funcao `spin`

1. **Subscriber**
- Inicializacao do no
- Usar a `create_subscription`
- Chamar o subscriber
- Implementar a `listener_callback`

## 3. QoS (Quality of Service)

### Três propriedades importantes:

- **Histórico (`history`)**
    - `KEEP_LAST`: mantém apenas as últimas *N* mensagens (mais usado)
    - `KEEP_ALL`: mantém todas as mensagens (pode consumir muita memória)
- **Confiabilidade (`reliability`)**
    - `BEST_EFFORT`: pode perder mensagens, mas tem menor latência
    - `RELIABLE`: garante entrega, mesmo que com atraso (padrão seguro)
- **Durabilidade (`durability`)**
    - `VOLATILE`: só recebe mensagens publicadas enquanto o nó estiver ativo
    - `TRANSIENT_LOCAL`: recebe até mensagens antigas se entrou depois

### Exemplo:

```python
from rclpy.qos import QoSProfile, ReliabilityPolicy

qos_profile = QoSProfile(
    depth=10,
    reliability=ReliabilityPolicy.RELIABLE
)
```

## 4. Parâmetros

### Por que usar?

- Evita ter que alterar o código para mudar valores simples
- Torna o nó reutilizável com diferentes configurações
- Permite ajustes em tempo real com `ros2 param`

### Molde de uso:

```python
self.declare_parameter('nome_param', valor_padrao)
valor = self.get_parameter('nome_param').get_parameter_value().tipo_value
```

### Exemplo:

Na inicialização:

```python
self.declare_parameter('nome_do_parametro', valor)
```

Na main:

```python
vel = self.get_parameter('nome_do_parametro').get_parameter_value().tipo_value
```

```bash
ros2 run pubsub publisher --ros-args -p nome:="Meu Nome"
```

Para mudar o parâmetro em tempo real, você pode fazer:

```bash
ros2 param set /minimal_publisher nome 'Meu Nome'
```

---

<aside>
⏭️

Próxima aula:

</aside>

### Próximo: [4. Configuração do pacote](4%20Configura%C3%A7%C3%A3o%20do%20pacote%201ec6e2fe69c4803ba795c79f90c4dee2.md)