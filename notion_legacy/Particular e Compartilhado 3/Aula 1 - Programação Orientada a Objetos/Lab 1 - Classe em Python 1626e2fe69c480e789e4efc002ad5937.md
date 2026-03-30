# Lab 1 - Classe em Python

## Introdução

Neste laboratório, vamos construir um Gerenciador de Tarefas usando classes.

---

## Parte 1: Criando a Estrutura Inicial

### Instrução:

Crie uma classe chamada `Tarefa` que represente uma tarefa com os seguintes atributos privados:

- `titulo` (string)
- `descricao` (string)
- `prioridade` (inteiro)

Implemente os seguintes métodos:

1. Um construtor (`__init__`) que inicializa os atributos.
2. Getters e setters para `titulo`, `descricao`, e `prioridade`, garantindo que a prioridade seja um valor entre 1 e 5.
3. Um método `__str__` que retorna uma string amigável com os detalhes da tarefa.

### Exemplo de Uso Esperado:

```python
# Após criar a classe corretamente, o seguinte código deve funcionar:
tarefa = Tarefa("Estudar", "Revisar conceitos de Python", 3)
print(tarefa)
# Saída esperada: "Tarefa: Estudar | Descrição: Revisar conceitos de Python | Prioridade: 3"

tarefa.titulo = "Trabalhar"
tarefa.descricao = "Preparar reunião"
tarefa.prioridade = 4
print(tarefa)
# Saída esperada: "Tarefa: Trabalhar | Descrição: Preparar reunião | Prioridade: 4"
```

---

## Parte 2: Trabalhando com Listas

### Instrução:

1. Crie uma lista de tarefas usando a classe `Tarefa`.
2. Implemente um método de classe `contar_tarefas` que recebe uma lista de tarefas e uma prioridade, retornando o número de tarefas com essa prioridade.

### Exemplo de Uso Esperado:

```python
# Após implementar corretamente:
tarefas = [
    Tarefa("Estudar", "Revisar conceitos de Python", 3),
    Tarefa("Academia", "Treino de musculação", 2),
    Tarefa("Ler", "Terminar livro", 3)
]

print(Tarefa.contar_tarefas(tarefas, 3))  # Saída esperada: 2
```

---

## Parte 3: Manipulando e Copiando Arrays

### Instrução:

1. Use uma lista para armazenar as prioridades das tarefas.
2. Crie uma cópia dessa lista.
3. Altere os valores na cópia e demonstre que as mudanças não afetam a lista original.
4. Faça uma cópia por atribuição normal (ex: `copia_prioridades = prioridades`), altere os valores dessa cópia e demonstre que as mudanças afetam a lista original.

### Exemplo de Uso Esperado:

```python
# Após implementar corretamente:
prioridades = [3, 2, 3]
copia_prioridades = prioridades.copy()
copia_prioridades[0] = 1
print(prioridades)           # Saída esperada: [3, 2, 3]
print(copia_prioridades)     # Saída esperada: [1, 2, 3]

# Testando atribuição normal
copia_prioridades = prioridades
copia_prioridades[0] = 1
print(prioridades)           # Saída esperada: [1, 2, 3]
```

---

<aside>
🚧

**SPOILERS ABAIXO —> GABARITO!**

</aside>

## Gabarito Completo

```python
# Parte 1: Classe Tarefa
class Tarefa:
    def __init__(self, titulo, descricao, prioridade):
        self._titulo = titulo
        self._descricao = descricao
        self._prioridade = prioridade

    @property
    def titulo(self):
        return self._titulo

    @titulo.setter
    def titulo(self, valor):
        self._titulo = valor

    @property
    def descricao(self):
        return self._descricao

    @descricao.setter
    def descricao(self, valor):
        self._descricao = valor

    @property
    def prioridade(self):
        return self._prioridade

    @prioridade.setter
    def prioridade(self, valor):
        if 1 <= valor <= 5:
            self._prioridade = valor
        else:
            raise ValueError("Prioridade deve ser entre 1 e 5")

    def __str__(self):
        return f"Tarefa: {self._titulo} | Descrição: {self._descricao} | Prioridade: {self._prioridade}"

    @classmethod
    def contar_tar(cls, tarefas, prioridade):
        return sum(1 for tarefa in tarefas if tarefa.prioridade == prioridade)

# Parte 2: Lista e Contagem
# Criando tarefas
tarefas = [
    Tarefa("Estudar", "Revisar conceitos de Python", 3),
    Tarefa("Academia", "Treino de musculação", 2),
    Tarefa("Ler", "Terminar livro", 3)
]

# Contando tarefas com prioridade específica
print(Tarefa.contar_tar(tarefas, 3))  # Saída esperada: 2

# Parte 3: Copiando Listas
prioridades = [3, 2, 3]
copia_prioridades = prioridades.copy()
copia_prioridades[0] = 1
print("Lista original:", prioridades)           # Saída esperada: [3, 2, 3]
print("Cópia explícita:", copia_prioridades)     # Saída esperada: [1, 2, 3]

# Testando atribuição normal
copia_prioridades = prioridades
copia_prioridades[0] = 5
print("Lista original após atribuição normal:", prioridades)  # Saída esperada: [5, 2, 3]
```

### [Lab 2 - Classe em C++](Lab%202%20-%20Classe%20em%20C++%201626e2fe69c4801da0abc9535ad24558.md)

<aside>
⏭️

Próximo passo:

</aside>

### [Lab 2 - Classe em C++](Lab%202%20-%20Classe%20em%20C++%201626e2fe69c4801da0abc9535ad24558.md)