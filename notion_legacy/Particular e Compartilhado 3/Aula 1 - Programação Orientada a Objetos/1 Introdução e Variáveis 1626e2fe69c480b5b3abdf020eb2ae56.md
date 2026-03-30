# 1. Introdução e Variáveis

## 1.1 Introdução

### Diferenças entre Python e C++

| Característica | Python | C++ |
| --- | --- | --- |
| **1. Tipagem** | Dinâmica (não precisa declarar tipo explicitamente) | Estática (tipos devem ser declarados) |
| **2. Compilação/Execução** | Interpretada (código executado diretamente) | Compilada (código convertido para binário antes durante build) |
| **3. Gerenciamento de Memória** | Automático. Não há liberação explícita de memória | Manual (uso de `new`/`delete` e controle direto). Exige atenção |
| **4. Bibliotecas** | Importação simplificada com palavras-chave | Inclui cabeçalhos explícitos |
| **5. Complexidade** | Simples e de alto nível | Controle mais baixo nível que Python. |

### Exemplos para Explicitar as Diferenças

1. **Tipagem**:
    - Python:
        
        ```python
        numero1 = 5 #Tipagem implicita, numero1 eh int
        numero2: int = 6  #Opcional: Tipagem explícita
        ```
        
        > Obs: A tipagem implícita pode causar problemas, como atribuir tipos inesperados:
        > 
        
        ```python
        x = "texto"
        x = x + 1  # Erro apenas em tempo de execução.
        ```
        
    - C++:
        
        ```cpp
        int x = 5 //Tipo sempre explícito
        ```
        
2. **Compilação/Execução**:
    - Python:
        
        ```python
        print("Este código roda diretamente, sem compilação.")
        ```
        
    - C++:
        - Código fonte:
            
            ```cpp
            #include <iostream>
            int main() {
                std::cout << "Este código precisa ser compilado primeiro." << std::endl;
                return 0;
            }
            ```
            
        - Comando para compilar e rodar:
            
            ```bash
            g++ programa.cpp -o programa # O COMPILADOR GERA OUTRO ARQUIVO .o QUE PODE SER EXECUTADO PELO COMPUTADOR
            ./programa # EXECUTAR
            ```
            
3. **Gerenciamento de Memória**:
    - Python:
        
        ```python
        lista = [1, 2, 3]  # Memória gerenciada automaticamente
        lista.append(4)
        print(lista)
        ```
        
    - C++:
        
        ```cpp
        #include <iostream>
        int main() {
            int* p = new int(10);  // Alocação dinâmica
            std::cout << *p << std::endl;
            delete p;  // Liberação manual
            return 0;
        }
        ```
        
4. **Bibliotecas**:
    - Python:
        
        ```python
        import math as mt
        print(mt.sqrt(16))
        ```
        
        > Você também pode importar módulos específicos da biblioteca:
        > 
        
        ```python
        from numpy import array
        arr = array([1, 2, 3])
        ```
        
    - C++:
        
        ```cpp
        #include <cmath>
        #include <iostream>
        int main() {
            std::cout << sqrt(16) << std::endl;
            return 0;
        }
        ```
        

---

## 1.2 Estruturas de Dados Básicas

### Tipos Primitivos e Compostos

Os tipos primitivos incluem:

- **Python:** `int`, `float`, `bool`, `str`.
- **C++:** `int`, `float`, `double`, `bool`, `std::string`.

Os tipos compostos oferecem maior flexibilidade:

| Tipo | Descrição | Aplicações | Sintaxe Python | Sintaxe C++ |
| --- | --- | --- | --- | --- |
| **list / vector** | Lista de elementos ordenados | Armazenamento geral | `x = [1, 2, 3]` | `std::vector<int> x = {1, 2, 3};` |
| **dict / map** | Associação chave-valor | Lookup tables, dicionários | `x = {"a": 1}` | `std::map<std::string, int> x; x["a"] = 1;` |
| **deque / deque** | Lista ordenada com inserção e remoção eficientes nas extremidades | Fila dupla | `from collections import deque` | `std::deque<int> x = {1, 2, 3};` |
| **array / array** | Coleção de tamanho fixo | Uso em estruturas fixas ou desempenho otimizado | `import array; x = array.array('i', [1, 2, 3])` | `std::array<int, 3> x = {1, 2, 3};` |

**Diferença entre lista e array:**

- **Python:**
    - `list`: Tamanho dinâmico, pode conter elementos de tipos diferentes.
    - `array.array`: Tamanho fixo, contém apenas elementos de um único tipo.
- **C++:**
    - `std::vector`: Tamanho dinâmico, com recursos para redimensionamento.
    - `std::array`: Tamanho fixo, mais eficiente em memória quando o tamanho é conhecido em tempo de compilação.

---

### Exemplo Prático

**Atividade prática:**

1. Crie e use um `dict` em Python:
    
    ```python
    dicionario = {"chave1": 10, "chave2": 20}
    dicionario["chave3"] = 30
    print("Dicionário:", dicionario)
    print("Valor da chave1:", dicionario["chave1"])
    ```
    
2. Crie e manipule um `std::array` e um `std::vector` em C++:
    
    ```cpp
    #include <vector>
    #include <array>
    #include <iostream>
    
    int main() {
        // Array
        std::array<int, 3> arr = {1, 2, 3};
        std::cout << "Array: ";
        for (auto val : arr) std::cout << val << " ";
        std::cout << std::endl;
    
        // Vector
        std::vector<int> vetor = {1, 2, 3};
        vetor.push_back(4);
        std::cout << "Vector: ";
        for (auto val : vetor)
    	    std::cout << val << " ";
        std::cout << std::endl;
    
        return 0;
    }
    ```
    
3. Crie e manipule um `std::deque` em C++:
    
    ```cpp
    #include <deque>
    #include <iostream>
    
    int main() {
        std::deque<int> fila = {1, 2, 3};
        fila.push_back(4);
        fila.push_front(0);
        std::cout << "Deque: ";
        for (auto val : fila) std::cout << val << " ";
        std::cout << std::endl;
    
        return 0;
    }
    ```
    

### Técnicas de Loop

- Python:
    
    ```python
    lista = [1, 2, 3]
    for i, val in enumerate(lista):
        print(f"Índice: {i}, Valor: {val}")
    
    for val in lista:
        print(f"Valor: {val}")
    ```
    
- C++:
    
    ```cpp
    #include <iostream>
    #include <vector>
    int main() {
        std::vector<int> lista = {1, 2, 3};
    
        // Loop tradicional com índice
        for (size_t i = 0; i < lista.size(); ++i) {
            std::cout << "Índice: " << i << ", Valor: " << lista[i] << std::endl;
        }
    
        // Loop for-each
        for (auto val : lista) {
            std::cout << "Valor: " << val << std::endl;
        }
    
        return 0;
    }
    ```
    

---

## 1.3 Estruturas de Dados Complexas

### Biblioteca Eigen (C++)

A Eigen é uma biblioteca de C++ para álgebra linear, usada para lidar com vetores e matrizes. Um vetor na Eigen é uma estrutura que pode armazenar múltiplos valores e oferece métodos para manipulá-los de forma eficiente.

- **Eigen::Vector:** Representa um vetor matemático com métodos para acessar elementos e realizar operações.
- **Eigen::Matrix:** Representa matrizes e suporta operações como multiplicação e transformações geométricas.

### Exemplo prático

**Acessando elementos:**

```cpp
#include <Eigen/Dense>
#include <iostream>

int main() {
    Eigen::Vector3f vetor(1, 2, 3);  // Vetor com três elementos
    std::cout << "Elemento 0: " << vetor[0] << std::endl;  // Por índice
    std::cout << "Elemento 1: " << vetor(1) << std::endl;  // Por método
    return 0;
}
```

**Saída:**

```
Elemento 0: 1
Elemento 1: 2
```

**Transformação de ponto:**

```cpp
#include <Eigen/Dense>
#include <iostream>

int main() {
    Eigen::Matrix3f transform;
    transform << 1, 0, 2,
                 0, 1, 3,
                 0, 0, 1;  // Matriz de transformação

    Eigen::Vector3f point(1, 1, 1);  // Ponto a ser transformado
    Eigen::Vector3f transformed_point = transform * point;

    std::cout << "Ponto transformado:\n" << transformed_point << std::endl;
    return 0;
}
```

---

## 1.4 Inicialização de Variáveis

### Python

- Tipagem dinâmica:
    
    ```python
    x = 10  # Inteiro
    y = 10.5  # Float
    z = "Olá"  # String
    ```
    

### C++

### Inicialização de `std::vector`:

```cpp
#include <vector>
#include <iostream>

int main() {
    std::vector<int> v1 = {1, 2, 3};  // Lista inicializadora com valores inteiros
    std::vector<int> v2(5, 0);        // Vetor de tamanho 5 preenchido com zeros
    std::vector<int> v3(v1);          // Cópia de outro vetor

    for (auto val : v3) std::cout << val << " ";
    return 0;
}
}
```

### Inicialização de `Eigen::Vector`:

```cpp
#include <Eigen/Dense>
#include <iostream>

int main() {
    Eigen::Vector3f v1(1, 2, 3);  // Inicialização direta com três valores
    Eigen::Vector3f v2;
    v2 << 4, 5, 6;                // Inicialização por operador

    std::cout << "v1: " << v1.transpose() << "\nv2: " << v2.transpose() << std::endl;
    return 0;
}
```

---

### Próximo tópico: [2. Ponteiros](2%20Ponteiros%201626e2fe69c48018937def7407364503.md)