# Ex 1 - Variáveis, ponteiros e classes

### **1. Básico: Valor vs. Endereço**

Declare uma variável **`int x = 10`**.

- Imprima o **valor** de **`x`**.
- Imprima o **endereço** de **`x`**.
- Declare um ponteiro **`int *p`** que aponte para **`x`**.
- Imprima o **valor de `p`** (endereço armazenado) e o **valor apontado por `p`** (**`p`**).

### **2. Modificando Valores via Ponteiro**

Crie uma variável **`float y = 3.14`**.

- Declare um ponteiro **`float *ptr`** que aponte para **`y`**.
- Use **`ptr`** para alterar o valor de **`y`** para **`5.67`**.
- Imprima **`y`** para confirmar a mudança.

### **3. Ponteiros e Funções**

Escreva uma função* **`void dobrar(int *num)`** que recebe um ponteiro para inteiro e dobra o valor da variável apontada.

- Teste com:

```cpp
int valor = 5;
dobrar(&valor);
// valor deve ser 10
```

*Se não souber o que é uma função, pesquise um exemplo (uma IA ajudaria bastante). É simples!

Mas caso queira, dá na mesma escrever direto no código main.

### **4. Ponteiro para Ponteiro (Ponteiro Duplo)**

Declare:

- Uma variável **`int a = 100`**.
- Um ponteiro **`int *p1 = &a`**.
- Um ponteiro duplo **`int **p2 = &p1`**.
- Imprima:
    - O valor de **`a`**.
    - O valor apontado por **`p1`** (**`p1`**).
    - O valor apontado por **`p2`** (**`*p2`**).
    - O endereço de **`p1`** (via **`p2`**).

### **5. Desafio: Troca com Ponteiros Duplos**

Crie uma função **`void trocar(int **pa, int **pb)`** que troque os **endereços** armazenados em **`pa`** e **`pb`**.

- Exemplo de uso:

```cpp
int x = 1, y = 2;
int *ptrX = &x, *ptrY = &y;
trocar(&ptrX, &ptrY);
// ptrX deve apontar para y, ptrY para x
```

### **6. Ponteiros e Arrays**

Declare um array **`int vetor[3] = {10, 20, 30}`**.

- Use um ponteiro **`int *p`** para percorrer o array e imprimir seus valores.
- Modifique o segundo elemento do array **usando aritmética de ponteiros** (ex: **`(p + 1) = 99`**).

### **7. Erros Comuns (Para Fixar)**

O código abaixo está errado. Corrija-o:

```cpp
int *p;
*p = 50; // O ponteiro não está inicializado!
```

### **8. Desafio Final em Ponteiros:**

Dado:

```cpp
int a = 5;
int *p1 = &a;
int **p2 = &p1;
int ***p3 = &p2;
```

- Use **`p3`** para modificar o valor de **`a`** para **`20`**.
- Imprima **`a`**, **`p1`**, **`*p2`** e **`**p3`** para confirmar.

### **9. Classe Básica**

1. Crie uma classe **`Livro`** com:
    - Atributos: **`titulo`** (string), **`autor`** (string), **`anoPublicacao`** (int).
    - Método **`void exibirDetalhes()`** que imprime todos os atributos.
    - Crie um objeto **`Livro`** no **`main()`**, atribua valores e chame **`exibirDetalhes()`**.
- Gabarito!
    
    ```cpp
    #include <iostream>
    #include <string>
    using namespace std;
    
    class Livro {
    public:
        string titulo;
        string autor;
        int anoPublicacao;
    
        void exibirDetalhes() {
            cout << "Título: " << titulo << endl
                 << "Autor: " << autor << endl
                 << "Ano: " << anoPublicacao << endl;
        }
    };
    
    int main() {
        Livro livro1;
        livro1.titulo = "1984";
        livro1.autor = "George Orwell";
        livro1.anoPublicacao = 1949;
        livro1.exibirDetalhes();
        return 0;
    }
    ```
    

### **10. Construtores e Destrutores**

1. Adicione à classe **`Livro`**:
    - Um **construtor padrão** que inicializa os atributos com valores vazios/zero.
    - Um **construtor parametrizado** que recebe **`titulo`**, **`autor`**, **`anoPublicacao`**.
    - Um **destrutor** que imprime **`"Livro [titulo] destruído!"`**.
2. No **`main()`**, crie objetos usando ambos os construtores.
- Gabarito!
    
    ```cpp
    class Livro {
    public:
        string titulo;
        string autor;
        int anoPublicacao;
    
        // Construtor padrão
        Livro() : titulo(""), autor(""), anoPublicacao(0) {}
    
        // Construtor parametrizado
        Livro(string t, string a, int ano) :
            titulo(t), autor(a), anoPublicacao(ano) {}
    
        // Destrutor
        ~Livro() {
            cout << "Livro \"" << titulo << "\" destruído!" << endl;
        }
    };
    
    int main() {
        Livro livroPadrao;
        Livro livroParam("Dom Quixote", "Cervantes", 1605);
        return 0;
    }
    ```
    

### **11. Encapsulamento (Getters/Setters)**

1. Modifique a classe **`Livro`**:
    - Torne os atributos **privados**.
    - Adicione métodos públicos **`getTitulo()`**, **`setTitulo(string novoTitulo)`**, etc.
    - No **`setAnoPublicacao(int ano)`**, valide se o ano é maior que 0.
- Gabarito!
    
    ```cpp
    class Livro {
    private:
        string titulo;
        string autor;
        int anoPublicacao;
    
    public:
        // Getters
        string getTitulo() { return titulo; }
        string getAutor() { return autor; }
        int getAno() { return anoPublicacao; }
    
        // Setters
        void setTitulo(string t) { titulo = t; }
        void setAutor(string a) { autor = a; }
        void setAno(int ano) {
            if (ano > 0) anoPublicacao = ano;
            else cout << "Ano inválido!" << endl;
        }
    };
    
    int main() {
        Livro livro;
        livro.setTitulo("Orgulho e Preconceito");
        livro.setAno(-1813); // Imprime "Ano inválido!"
        return 0;
    }
    ```
    

### **12. Herança Simples**

1. Crie uma classe base **`Veiculo`** com:
    - Atributos: **`string marca`**, **`int velocidade`**.
    - Método **`void acelerar(int incremento)`**.
2. Crie uma classe derivada **`Carro`** que sobrescreve **`acelerar()`** para não ultrapassar **`velocidade = 200`**.
- Gabarito!
    
    ```cpp
    class Veiculo {
    public:
        string marca;
        int velocidade = 0;
    
        void acelerar(int incremento) {
            velocidade += incremento;
        }
    };
    
    class Carro : public Veiculo {
    public:
        void acelerar(int incremento) {
            if (velocidade + incremento <= 200)
                velocidade += incremento;
            else
                velocidade = 200;
        }
    };
    
    int main() {
        Carro fusca;
        fusca.acelerar(250);
        cout << fusca.velocidade; // Imprime 200
        return 0;
    }
    ```
    

---

<aside>
⏭️

Próximo passo: Lab em Python

</aside>

### [Lab 1 - Classe em Python](Lab%201%20-%20Classe%20em%20Python%201626e2fe69c480e789e4efc002ad5937.md)