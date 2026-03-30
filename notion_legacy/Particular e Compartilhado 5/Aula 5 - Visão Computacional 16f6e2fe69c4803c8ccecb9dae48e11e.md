# Aula 5 - Visão Computacional

### SLAM

### Treinar rede neural

- Introdução a CNNs e algoritmos atuais
- Mundo no Blender
- Gerar dataset de imagens
- Gerar anotações
- Treinar yolov8 no Colab
    - Métricas de Object Detection
    - Semantic Segmentation

### Nó de visão computacional

- Usar rede neural (weights.pt)
- Subscriber na imagem
- Publisher da imagem anotada
- Publisher da classificação

### Na classe Drone

- Subscriber da classificação
- Lógica de tratamento das bounding boxes
- PID sobre a bounding box

## Orquestração

- Parâmetros:
    - params.yaml

- Arquivo de launch:
    - Nó camera_publisher
    - Nó visão computacional
    - Nó de FSM