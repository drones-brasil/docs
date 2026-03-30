# 4. Tópicos Avançados de POO

## 4.1 Herança

- **Definição:** Herança é um mecanismo em que uma classe (chamada de "classe derivada") herda atributos e métodos de outra classe ("classe base" ou "superclasse").
- **Objetivo:** Facilitar a reutilização de código e modelar hierarquias de classes que refletem relações do mundo real.

### Python

```python
class Veiculo:
    def __init__(self, marca, modelo):
        self.marca = marca
        self.modelo = modelo

    def exibir_detalhes(self):
        print(f"Marca: {self.marca}, Modelo: {self.modelo}")

# Classe derivada
class Carro(Veiculo):
    def __init__(self, marca, modelo, num_portas):
        super().__init__(marca, modelo)  # Chama o construtor da superclasse
        self.num_portas = num_portas

    def exibir_detalhes(self):
        super().exibir_detalhes()  # Reutiliza o método da superclasse
        print(f"Número de portas: {self.num_portas}")

carro = Carro("Toyota", "Corolla", 4)
carro.exibir_detalhes()
```

**Saída:**

```
Marca: Toyota, Modelo: Corolla
Número de portas: 4
```

### C++

```cpp
#include <iostream>
#include <string>

class Veiculo {
protected:
    std::string marca;
    std::string modelo;

public:
    Veiculo(const std::string& m, const std::string& mod) : marca(m), modelo(mod) {}

    virtual void exibirDetalhes() const {
        std::cout << "Marca: " << marca << ", Modelo: " << modelo << std::endl;
    }
};

// Classe derivada
class Carro : public Veiculo {
private:
    int numPortas;

public:
    Carro(const std::string& m, const std::string& mod, int portas) : Veiculo(m, mod), numPortas(portas) {}

    void exibirDetalhes() const override {
        Veiculo::exibirDetalhes();  // Reutiliza o método da classe base
        std::cout << "Número de portas: " << numPortas << std::endl;
    }
};

int main() {
    Carro carro("Toyota", "Corolla", 4);
    carro.exibirDetalhes();
    return 0;
}
```

**Saída:**

```
Marca: Toyota, Modelo: Corolla
Número de portas: 4
```

### Tipos de Herança em C++

1. **Herança Pública (`public`):**
    - Acessibilidade original dos membros é mantida (ex.: `public` permanece `public`).
2. **Herança Protegida (`protected`):**
    - Os membros `public` e `protected` da classe base se tornam `protected` na classe derivada.
3. **Herança Privada (`private`):**
    - Todos os membros herdados tornam-se `private` na classe derivada.

### Cuidados com Herança

- Evitar hierarquias muito profundas (dificulta a manutenção).
- Usar herança somente quando há uma relação clara de "é um".

---

## 4.2 Polimorfismo

- **Definição:** Capacidade de usar métodos de uma classe base de forma diferente nas classes derivadas. O método chamado é determinado pelo tipo real do objeto (e não pelo tipo da variável que o referencia).
- **Objetivo:** Tornar o código mais flexível e extensível, permitindo que o mesmo código funcione com diferentes tipos de objetos.

### Python

Em Python, o polimorfismo ocorre naturalmente devido à sua tipagem dinâmica.

**Exemplo:**

```python
class Veiculo:
    def mover(self):
        print("O veículo está se movendo")

class Carro(Veiculo):
    def mover(self):
        print("O carro está dirigindo")

class Aviao(Veiculo):
    def mover(self):
        print("O avião está voando")

# Função que usa polimorfismo
def mover_veiculo(veiculo):
    veiculo.mover()

veiculos = [Carro(), Aviao()]
for veiculo in veiculos:
    mover_veiculo(veiculo)
```

**Saída:**

```
O carro está dirigindo
O avião está voando
```

### C++

Em C++, o polimorfismo é implementado usando métodos virtuais e, opcionalmente, ponteiros ou referências.

`virtual`: são um mecanismo para implementar **polimorfismo dinâmico**. Vou explicar na próxima seção.

**Exemplo:**

```cpp
#include <iostream>

class Veiculo {
public:
    virtual void mover() const {  // Método virtual
        std::cout << "O veículo está se movendo" << std::endl;
    }
    virtual ~Veiculo() = default;  // Destrutor virtual
};

class Carro : public Veiculo {
public:
    void mover() const override {  // Sobrescreve o método
        std::cout << "O carro está dirigindo" << std::endl;
    }
};

class Aviao : public Veiculo {
public:
    void mover() const override {
        std::cout << "O avião está voando" << std::endl;
    }
};

void moverVeiculo(const Veiculo& veiculo) {
    veiculo.mover();  // Polimorfismo: chama o método adequado
}

int main() {
    Carro carro;
    Aviao aviao;

    moverVeiculo(carro);
    moverVeiculo(aviao);

    return 0;
}
```

**Saída:**

```
O carro está dirigindo
O avião está voando
```

### Polimorfismo Estático vs Dinâmico

- **Estático (ou em tempo de compilação):**
    - Implementado com **sobrecarga de funções** ou **operadores** (ex.: funções com o mesmo nome, mas diferentes assinaturas).
    - Exemplo em C++:
        
        ```cpp
        class Calculadora {
        public:
            int soma(int a, int b) {
                return a + b;
            }
        
            double soma(double a, double b) {
                return a + b;
            }
        };
        ```
        
- **Dinâmico (ou em tempo de execução):**
    - Implementado com métodos virtuais.
    - Permite que objetos derivados forneçam suas próprias implementações de métodos da classe base.

### Aprofundando funções `virtual` (C++)

<aside>
🍎

Internamente, as funções virtuais utilizam uma **tabela virtual (vtable)**. Cada classe que define ou herda funções virtuais possui uma tabela virtual, e cada objeto da classe mantém um ponteiro para essa tabela (**vptr**). Quando um método virtual é chamado, a vtable é usada para determinar a função apropriada.

</aside>

**Exemplo:**

```cpp
#include <iostream>using namespace std;

class Animal {
public:
    virtual void fazerSom() const {  // Função virtual
        cout << "Animal faz som genérico" << endl;
    }

    virtual ~Animal() {}  // Destrutor virtual
};

class Cachorro : public Animal {
public:
    void fazerSom() const override {  // Sobrescrevendo a função virtual
        cout << "Cachorro faz: Au Au" << endl;
    }
};

class Gato : public Animal {
public:
    void fazerSom() const override {  // Sobrescrevendo a função virtual
        cout << "Gato faz: Miau" << endl;
    }
};

int main() {
    Animal* animal1 = new Cachorro();
    Animal* animal2 = new Gato();

    animal1->fazerSom();  // Chama a implementação de Cachorro
    animal2->fazerSom();  // Chama a implementação de Gato

    delete animal1;
    delete animal2;

    return 0;
}
```

**Saída:**

```yaml
Cachorro faz: Au Au
Gato faz: Miau
```

<aside>
🔥

**Explicando o exemplo:**

1. **Função Virtual na Classe Base:**
    - `fazerSom()` na classe `Animal` é declarada como virtual, permitindo que classes derivadas a sobrescrevam.
2. **Sobrescrita:**
    - `Cachorro` e `Gato` fornecem implementações específicas de `fazerSom()`.
3. **Ponteiro para Classe Base:**
    - As chamadas para `animal1->fazerSom()` e `animal2->fazerSom()` são feitas usando ponteiros para `Animal`, mas executam as implementações de `Cachorro` e `Gato`, respectivamente.
4. **Destrutores Virtuais:**
    - O destrutor virtual de `Animal` garante que o destrutor das classes derivadas seja chamado corretamente quando o objeto é deletado via um ponteiro para a classe base.
</aside>

---

## 4.3 Comparação: Python vs C++

| Aspecto | Python | C++ |
| --- | --- | --- |
| **Herança** | Suporte direto com `class Derived(Base)` | Suporte explícito com `: public Base` |
| **Polimorfismo** | Natural, devido à tipagem dinâmica | Requer métodos virtuais e ponteiros/referências |
| **Métodos Virtuais** | Não necessários; todos os métodos são "virtuais" por padrão | Explicitamente marcados com `virtual` |
| **Sobrecarga de Métodos** | Não suportada diretamente | Suportada via assinatura distinta |
| **Desempenho** | Mais lento devido à flexibilidade | Mais rápido, mas exige maior controle |

---

*Parabéns, você concluiu a Aula 1. Programação Orientada a Objetos!!* 🚀 Próximo passo: Exercícios Propostos

### Pratique: [Ex 1 - Variáveis, ponteiros e classes](Ex%201%20-%20Vari%C3%A1veis,%20ponteiros%20e%20classes%201e56e2fe69c480dba1e9ea039d74849f.md)