# 3. Introdução a Classes

## 3.1 Fundamentos de Classes

Uma Classe é um modelo (blueprint) que define as características e comportamentos de objetos.

<aside>
🧞

**A ideia é** agrupar tanto dados (variáveis) quanto métodos (funções). Modelar problemas de mundo real como objetos é mais natural - pense numa pessoa, que tem tanto atributos (nome, idade), quanto funções (andar, falar, …).

</aside>

- **Exemplo (Python):**
    
    ```python
    class Carro:
        def __init__(self, marca, modelo):
            self.marca = marca
            self.modelo = modelo
    
        def exibir_detalhes(self):
            print(f"Marca: {self.marca}, Modelo: {self.modelo}")
    
    carro = Carro("Toyota", "Corolla")
    carro.exibir_detalhes()
    ```
    
    **Saída:**
    
    ```
    Marca: Toyota, Modelo: Corolla
    ```
    
- **Exemplo (C++):**
    
    ```cpp
    #include <iostream>
    #include <string>
    
    class Carro {
    private:
        std::string marca;
        std::string modelo;
    
    public:
        Carro(const std::string& m, const std::string& mod) : marca(m), modelo(mod) {}
    
        void exibirDetalhes() const {
            std::cout << "Marca: " << marca << ", Modelo: " << modelo << std::endl;
        }
    };
    
    int main() {
        Carro carro("Toyota", "Corolla");
        carro.exibirDetalhes();
        return 0;
    }
    ```
    
    **Saída:**
    
    ```
    Marca: Toyota, Modelo: Corolla
    ```
    

---

## 3.2 Construtores e Destrutores

### Construtores

- **Definição:** Métodos especiais usados para inicializar objetos.
- **Python:** O método `__init__` atua como o construtor.
- **C++:** Um método com o mesmo nome da classe.

**Exemplo (Python):**

```python
class Pessoa:
    def __init__(self, nome, idade):
        self.nome = nome
        self.idade = idade

    def exibir_detalhes(self):
        print(f"Nome: {self.nome}, Idade: {self.idade}")

pessoa = Pessoa("Ana", 30)
pessoa.exibir_detalhes()
```

**Saída:**

```
Nome: Ana, Idade: 30
```

**Exemplo (C++):**

```cpp
#include <iostream>
#include <string>

class Pessoa {
private:
    std::string nome;
    int idade;

public:
    Pessoa(const std::string& n, int i) : nome(n), idade(i) {}

    void exibirDetalhes() const {
        std::cout << "Nome: " << nome << ", Idade: " << idade << std::endl;
    }
};

int main() {
    Pessoa pessoa("Ana", 30);
    pessoa.exibirDetalhes();
    return 0;
}
```

**Saída:**

```
Nome: Ana, Idade: 30
```

### Destrutores

- **Definição:** Métodos usados para liberar recursos ou executar ações específicas ao destruir objetos.
- **Python:** O método `__del__` pode ser usado, mas raramente é necessário devido ao garbage collector.
- **C++:** Declarado com um `~` antes do nome da classe.

**Exemplo (C++):**

```cpp
#include <iostream>

class Recurso {
public:
    Recurso() {
        std::cout << "Recurso alocado" << std::endl;
    }

    ~Recurso() {
        std::cout << "Recurso liberado" << std::endl;
    }
};

int main() {
    {
        Recurso r;
    }  // Destrutor chamado ao sair do escopo
    return 0;
}
```

**Saída:**

```
Recurso alocado
Recurso liberado
```

---

## 3.3 Encapsulamento

### O que é Encapsulamento?

- **Definição:** Esconde os detalhes internos de implementação e protege os dados de acessos inadequados.
- **Modificadores de Acesso (C++):**
    - `public`: Acessível de qualquer lugar.
    - `private`: Acessível apenas dentro da classe.
    - `protected`: Acessível na classe e em subclasses.

### Python

- **Práticas comuns:**
    - Atributos com `_` (proteção implícita). O *underscore* é apenas parte do nome, é uma convenção para dizer ao programador que aquela variável não deve ser acessada diretamente.
    - Uso de `@property` para getters e setters.
    1. **`@property`:** transforma uma função em um atributo apenas para leitura. Na prática, é acessar o método sem usar o parênteses (olhe o exemplo).
    2. **`@saldo.setter`:** é simplesmente uma função que altera o valor do atributo sem utilizar parênteses quando é chamado.

**Exemplo (Python):**

```python
class ContaBancaria:
    def __init__(self, saldo):
        self._saldo = saldo  # O atributo interno, protegido implicitamente        
    @property
    def saldo(self):
        return self._saldo

    @saldo.setter
    def saldo(self, valor):
        if valor < 0:
            print("Valor inválido")
        else:
            self._saldo = valor

conta = ContaBancaria(1000)
print(conta.saldo)
conta.saldo = 500
print(conta.saldo)
```

**Saída:**

```
1000
500
```

<aside>
🙉

**Não entendeu? A ideia é a seguinte:**
Nós poderíamos ter acessado ou modificado a variavel `conta.saldo` sem os *getters* e *setters*. Mas concorda que, no caso em que `if valor < 0`, a gente estaria fazendo um erro?

Por isso, nós usamos esses **decorators** (`property`, `saldo.setter`) para **proteger o comportamento** do nosso objeto, mas mantendo uma **sintaxe curta** (`conta.saldo`)**,** igual se não usássemos essas funções. 

</aside>

### C++

**Exemplo (C++):**

```cpp
#include <iostream>

class ContaBancaria {
private:
    double saldo;

public:
    ContaBancaria(double s) : saldo(s) {}

    double getSaldo() const { // é boa prática usar const
    };// p/ garantir que vars nao sao alteradas
    
    void setSaldo(double valor) {
        if (valor < 0) {
            std::cout << "Valor inválido" << std::endl;
        } else {
            saldo = valor;
        }
    }
};

int main() {
    ContaBancaria conta(1000);
    std::cout << conta.getSaldo() << std::endl;
    conta.setSaldo(500);
    std::cout << conta.getSaldo() << std::endl;
    return 0;
}
```

**Saída:**

```
1000
500
```

---

## 3.4 Tipos de Métodos

### Métodos de Classe

- **Definição:** Usam o decorator `@classmethod` (Python) ou a palavra-chave `static` (C++) para acessar dados da classe, mas não das instâncias.

**Exemplo (Python):**

```python
class Pessoa:
    populacao = 0

    def __init__(self, nome):
        self.nome = nome
        Pessoa.populacao += 1

    @classmethod
    def obter_populacao(cls):
        return cls.populacao

p1 = Pessoa("Carlos")
p2 = Pessoa("Ana")
print(Pessoa.obter_populacao())
```

**Saída:**

```
2
```

**Exemplo (C++):**

```cpp
#include <iostream>

class Pessoa {
private:
    static int populacao;

public:
    Pessoa() { populacao++; }

    static int obterPopulacao() {
        return populacao;
    }
};

int Pessoa::populacao = 0;

int main() {
    Pessoa p1, p2;
    std::cout << Pessoa::obterPopulacao() << std::endl;
    return 0;
}
```

**Saída:**

```
2
```

### Métodos Estáticos

- **Definição:** Métodos que não dependem de dados de instância ou da classe.

**Exemplo (Python):**

```python
class Calculadora:
    @staticmethod
    def soma(a, b):
        return a + b

print(Calculadora.soma(5, 3))
```

**Saída:**

```
8
```

**Exemplo (C++):**

```cpp
#include <iostream>

class Calculadora {
public:
    static int soma(int a, int b) {
        return a + b;
    }
};

int main() {
    std::cout << Calculadora::soma(5, 3) << std::endl;
    return 0;
}
```

**Saída:**

```
8
```

---

## 3.5 Métodos Especiais

### Python: Dunder Methods

- **Definição:** Métodos que começam e terminam com `__`, usados para personalizar o comportamento de classes.
- **Exemplos Comuns:**
    - `__str__`: Representação amigável de um objeto.
    - `__repr__`: Representação oficial de um objeto.
    - `__eq__`: Comparação de igualdade.

**Exemplo:**

```python
class Pessoa:
    def __init__(self, nome, idade):
        self.nome = nome
        self.idade = idade

    def __str__(self):
        return f"{self.nome}, {self.idade} anos"

pessoa = Pessoa("Carlos", 25)
print(pessoa)
```

**Saída:**

```
Carlos, 25 anos
```

### Python: Protocolos de Iteração

- **Definição:** Permitem criar objetos que podem ser iterados com `for`.
- **Métodos Necessários:**
    - `__iter__`: Retorna o próprio objeto ou um iterador.
    - `__next__`: Retorna o próximo valor ou levanta `StopIteration`.

**Exemplo:**

```python
class Contador:
    def __init__(self, limite):
        self.limite = limite
        self.atual = 0

    def __iter__(self):
        return self

    def __next__(self):
        if self.atual < self.limite:
            self.atual += 1
            return self.atual
        raise StopIteration

contador = Contador(5)
for numero in contador:
    print(numero)
```

**Saída:**

```
1
2
3
4
5
```

### C++: Sobrecarga de Operadores

- **Definição:** Permite redefinir operadores como `+`, `==`, etc., para uso com objetos.

**Exemplo:**

```cpp
#include <iostream>

class Vetor {
private:
    int x, y;

public:
    Vetor(int x, int y) : x(x), y(y) {}

    Vetor operator+(const Vetor& outro) const {
        return Vetor(x + outro.x, y + outro.y);
    }

    void exibir() const {
        std::cout << "(" << x << ", " << y << ")" << std::endl;
    }
};

int main() {
    Vetor v1(1, 2), v2(3, 4);
    Vetor v3 = v1 + v2;
    v3.exibir();
    return 0;
}
```

**Saída:**

```
(4, 6)
```

---

## 3.6 Namespaces

- **Definição:** Namespaces são usados em C++ para organizar classes, funções e variáveis, evitando conflitos de nomes.

**Exemplo:**

```cpp
#include <iostream>

namespace Matematica {
    int soma(int a, int b) {
        return a + b;
    }
}

int main() {
    std::cout << Matematica::soma(5, 3) << std::endl;
    return 0;
}
```

**Saída:**

```
8
```

### Usando `using`

- Evita o uso repetido do prefixo do namespace.

**Exemplo:**

```cpp
#include <iostream>

namespace Matematica {
    int soma(int a, int b) {
        return a + b;
    }
}

using namespace Matematica;

int main() {
    std::cout << soma(5, 3) << std::endl;
    return 0;
}
```

**Saída:**

```
8
```

---

### Pŕoxima Página: [4. Tópicos Avançados de POO](4%20T%C3%B3picos%20Avan%C3%A7ados%20de%20POO%201626e2fe69c480d58efccc377288590c.md)