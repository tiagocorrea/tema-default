_**Atenção**: Este recurso está em fase beta, liberado apenas para lojas
selecionadas. Para tirar suas dúvidas, entre em contato com nosso suporte em
support [at] tanlup [dot] com._

# Tema Default

Este é o tema padrão das lojas do Tanlup!

Ele é usado em todas as lojas da plataforma e pode ser totalmente alterado ou
estendido. Neste documento você pode aprender como fazer isto!

Através de nosso novo sistema de personalização de lojas você pode acessar não
apenas o CSS do tema padrão, mas alterar totalmente o HTML de sua loja usando
uma linguagem de template simples e prática. Tentamos tirar do seu caminho
qualquer complicação para que a personalização possa ser profunda mas ainda
assim, simples.

# Primeiros passos

**Hey, você já é um expert?** Então talvez você queira pular esta seção e ir
direto para a parte onde a gente te passa todos os detalhes de nosso sistema.
Clica [aqui](#sintaxe)! Se este não for o caso, ótimo! A seguir você encontra
uma boa introdução ao sistema, ensinando os principais conceitos.

Antes de começar é importante deixar claro que será necessário ter conhecimentos
mínimos nas seguintes tecnologias:

- [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)
- [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

Através destas tecnologias você será capaz de transformar o tema de sua loja de
forma completa, alcançando os objetivos estéticos e funcionais que desejar.

Para viabilizar a personalização das lojas em nossa plataforma optamos por
adotar uma linguagem de templates muito prática e simples de usar chamada
[Twig](http://twig.sensiolabs.org/). Se você quiser ter uma visão geral sobre
a linguagem e aprender direto da fonte, visite a documentação
[aqui](http://twig.sensiolabs.org/doc/templates.html) (em inglês). É importante
notar que alguns recursos da linguagem são limitados em nosso ambiente e este
documento especifica quais são estas limitações e possíveis diferenças entre o
que o Twig oferece e o que está disponível em nosso ambiente. Sempre que tiver
dúvidas, fique à vontade para entrar em contato com nossa equipe de suporte.

Tendo dito isto, **por onde começar?**

## Entendendo a estrutura

Uma loja é formada por diversas páginas. Temos uma página para a home, outra
para as listagens de categorias. Uma para a página de produto, outra para as
páginas de conteúdos avulsos e por aí vai. Para cada página destas temos um
template diferente em nosso sistema e cada template fica em um arquivo
específico. Além dos arquivos de cada página temos um template "master" chamado
layout. Ao invés de carregar as informações de cada página, é este layout que
organiza onde estes conteúdos serão renderizados, funcionando como um template
padrão para todos os outros templates. Imagine que cada template é como uma
fotografia e o layout é um porta-retratos. Independentemente da foto que foi
colocada no porta-retratos, ele não se altera. É mais ou menos isso!

A estrutura dos arquivos é assim:

Arquivo | Descrição
--------|----------
`layout` | Arquivo principal do tema de sua loja. Define a estrutura padrão para todas as páginas.
`home` | Arquivo carregado na homepage de sua loja.
`products` | Arquivo com a listagem de todos os produtos de sua loja com paginação.
`productelm` | Um simples arquivo que pode ser incluído para facilitar a listagem de produtos. Este arquivo define a estrutura de um produto sendo mostrado numa listagem como a da página `products`.
`product` | Arquivo que mostra todos os detalhes do produto e permite a adição do produto ao carrinho.
`category` | Listagem de todos os produtos de uma determinada categoria. Similar ao `products`.
`search` | Listagem de todos os produtos de uma determinada busca. Similar ao `products`.
`tag` | Listagem de todos os produtos de uma determinada tag. Similar ao `products`.
`page` | Mostra o conteúdo de uma página avulsa.
`contact` | Página contendo o formulário de contato com a loja.

Ao criar seu tema personalizado você não precisa necessariamente modificar ou
providenciar todos estes arquivos. Nosso sistema irá identificar se algum dos
arquivos não foi implementado e irá carregar o arquivo padrão. Assim você só
modifica o que realmente desejar, inclusive todos os arquivos se assim desejar.

Tendo conhecido a estrutura de arquivos e para que serve cada um deles, vamos
descobrir como começamos a desenvolver um novo tema!

## O menor layout do mundo

Para entender como a linguagem de templates é simples vamos criar agora o menor
`layout` funcional que você pode ter em um tema:

```twig
<!DOCTYPE html>
<html>
    <head>
        <title>Minha loja sensacional</title>
    </head>

    <body>
        <h1>Minha loja sensacional</h1>
        <div>{% block content %}{% endblock %}</div>
        {{ loadJs() }}
    </body>
</html>
```

Tá bom, talvez este não seja o menor layout do mundo, mas deu pra ter uma ideia!

Se você não entendeu nada do que fizemos agora não se preocupe. Tudo será
explicado a tempo. Como dissemos anteriormente, o `layout` é um arquivo master
a partir do qual os outros arquivos serão carregados. Isso quer dizer que tudo
o que está definido nesta página **irá aparecer em todas as outras páginas de
sua loja**. Agora vamos dar um exemplo simples de uma `home`:

```twig
{% extends 'layout' %}

{% block content %}
    Seja bem vindo à "Minha loja sensacional"! Aqui você encontra os
    produtos mais supimpas da face deste universo.
{% endblock %}
````

O que vai acontecer quando alguém acessar a homepage de sua loja? O conteúdo
definido no arquivo `home` será carregado dentro do bloco **content** de seu
`layout`. Vamos analisar direitinho cada linha para entender o que está
acontecendo.

Vamos começar pelo nosso `layout`. Tudo está muito familiar até a seguinte
linha:

```twig
<div>{% block content %}{% endblock %}</div>
```

O que este pedaço de código esta dizendo é que qualquer outro template que
estenda este template poderá suprir o conteúdo necessário a ser injetado dentro
deste bloco. Estamos definindo uma área que, de certa forma, pode ser
sobrescrita em templates que estendam o `layout`.

Mais à frente no `layout` temos uma outra linha diferente:

```twig
{{ loadJs() }}
```

Aqui estamos chamando uma **função** chamada **loadJs**. É muito importante que
esta função seja chamada em seu `layout`, caso contrário sua loja não
funcionará corretamente. Iremos explicar seu funcionamento e o que são funções
mais à frente, mas é importante dizer desde já que _**a inclusão desta função é
obrigatória**_ em seu `layout`.

Agora vamos partir para o arquivo `home`. A primeira linha neste arquivo já é
diferente do que encontramos normalmente em um arquivo HTML comum:

```twig
{% extends 'layout' %}
```

Esta linha deixa claro que este template irá estender o nosso `layout`
principal. De fato, todos os outros arquivos de nosso tema **devem começar com
esta linha**! Uma vez que seu template estende um outro template ele já não pode
mais ter "conteúdo próprio". Tudo dentro dele deve prover o conteúdo para blocos
préviamente definidos no template sendo estendido. Lembra que no nosso `layout`
criamos um bloco chamado **content**? Bom, vamos então fornecer algum conteúdo
para ele em nosso template `home`. A gente faz isso definindo novamente o bloco
e inserindo dentro dele o conteúdo que queremos ver renderizado no bloco do
template sendo estendido. Assim:

```twig
{% block content %}
    Seja bem vindo à "Minha loja sensacional"! Aqui você encontra os
    produtos mais supimpas da face deste universo.
{% endblock %}
```

Tudo o que estiver entre `{% block content%}` e `{% endblock %}` será injetado
no bloco com o mesmo nome em `layout`.

Veja que o nome do bloco na verdade não importa. Por convenção usamos "content"
para definir o bloco de conteúdo principal, mas teoricamente o nome deste bloco
pode ser qualquer coisa. Também é possível definir multiplos blocos em seu
layout padrão. De fato, nosso tema padrão faz isso. Você pode conferir isto
[aqui](https://github.com/tanlup/tema-default/blob/master/layout.twig#L4).
Apesar disto, recomendamos que o nome do bloco principal sempre seja "content"
para não haver qualquer confusão. Fica a dica!

**Parabéns!** Você já sabe os principais conceitos para personalizar seu tema e
sua loja! Agora que tal fuçar um pouco no código de nosso tema padrão para ver
como implementamos cada uma das coisas presentes nas lojas? Vai lá!

Ok! Provavelmente você deve estar confuso com um monte de outras coisas que
aparecem no código e que a gente não explicou ainda né? Não se preocupe. A gente
vai fazer isso agora!

# Sintaxe

Como dito anteriormente, nosso sistema é feito com base na biblioteca **Twig**.
A sintaxe em si é muito simples e vamos tentar cobrir os principais recursos.

Em resumo a linguagem é formada por **variáveis**, **filtros**, **tags** e
**funções**.

- **Variáveis** te dão acesso a informações dinâmicas de sua loja como o endereço
de sua loja ou o nome de um produto.
- **Filtros** são pequenas funções que realizam algum tipo de alteração em
variáveis. Eles também serve para extrair informações de variáveis específicas.
- **Funções** te permitem executar uma determinada tarefa ou gerar algum tipo
de conteúdo.
- **Tags** fornecem métodos de controle do conteúdo e lógica de seus templates.

## Variáveis

Usar variáveis em seu template é algo realmente simples. Veja:

```twig
R$ {{ product.price }}
O nome da minha loja é {{ store.name }}
```

Quando executado, este template irá imprimir o preço do produto ou o nome da
loja no lugar onde você colocou os colchetes em torno do nome de uma determinada
variável. O nome da variável é algo pré definido e mais à frente vamos te
mostrar todas as variáveis disponíveis e em qual páginas você pode acessá-las.
Saber manipular estas variáveis é a coisa mais importante que você deve aprender
para criar um tema supimpa.

## Filtros

É possível realizar alterações nas variáveis usando filtros. Veja:

```twig
R$ {{ product.price|number_format }}
```

A sintaxe é bem parecida com a utilização de uma variável simples, mas veja que
temos um `|number_format` logo depois do nome da variável. Através desta
informação a gente está definindo que a variável `product.price` irá passar pelo
filtro `number_format` antes de ser impressa na tela. O que este filtro faz é
formatar o preço do produto no formato monetário brasileiro de forma que a linha
acima irá imprimir algo assim na tela:

```
R$ 123,40
```

Enquanto, se a gente não usar o filtro, o resultado seria este:

```
R$ 123.4
```

Existem muitos outros filtros que te permitem fazer alterações diferentes. Vamos
explicar cada uma delas mais à frente.

## Funções

Com funções você consegue gerar algum tipo de conteúdo específico de forma
prática. Veja:

```twig
{{ renderContactForm() }}
```

Veja que a sintaxe é muito similar à de você imprimir uma variável na tela,
porém você precisa colocar os parênteses ao final do nome da função. A função
acima irá renderizar todo um formulário de contato na tela. Em algumas funções
é possível passar alguns parâmetros dentro dos parênteses.

## Tags

Talvez uma das partes mais importantes da sintaxe de nossa linguagem de template
sejam as tags. Através dela você consegue controlar o fluxo e a estrutura de
seus arquivos. Vamos dar uma olhada mais profunda em alguns tipos principais de
tags.

### if ... else

Uma das principais formas de controlar a lógica e fluxo de seu template é usando
a tag `if`. Veja um exemplo:

```twig
{% if store.notification %}
    <div id="notifications">{{ store.notification }}</div>
{% endif %}
```

Se você percebeu, já temos uma diferença interessante em como chamamos as tags.
Veja que ao invés de usarmos dois colchetes `{{ ... }}` como nas variáveis, nós
usamos `{% ... %}`. Isto porque tags em geral são instruções e não imprimem
nada na tela. É um jeito fácil da gente identificar uma coisa ou outra.

O que o código acima faz é verificar se a variável `store.notification` está
definida ou tem um valor positivo. Se sim, ele vai mostrar o conteúdo da
notificação. Caso contrário, nada acontece. Mas e se a gente quiser mostrar
uma outra mensagem no lugar da notificação caso ela não exista ou não esteja
definida?

```twig
{% if store.notification %}
    <div id="notifications">{{ store.notification }}</div>
{% else %}
    <div>Nada por aqui...</div>
{% endif %}
```

Neste caso, usamos o `else` para definir algum conteúdo se a primeira condição
não for verdadeira. Ou seja, se não houver notificação a gente mostra a mensagem
"Nada por aqui..." dentro de um elemento *div*.

O funcionamento é basicamente este. Se você quiser se aprofundar vale sempre a
pena dar uma olhada na documentação oficial do Twig a respeito desta tag
[aqui](http://twig.sensiolabs.org/doc/tags/if.html) (em inglês).

### for

Cada variável em nosso templates é um tipo de dado diferente: um texto, um
número, assim por diante. Eventualmente algumas destas variáveis serão de um
tipo que chamamos de arrays ou vetores. Pense neles como uma fila onde você
pode colocar um monte de outros dados. Eu sei... É meio vago, mas eu garanto que
tudo isso vai fazer sentido quando a gente começar a explorar melhor as
variáveis.

O importante aqui é entender que com a tag `for` você pode iterar pelos
elementos de um vetor e realizar ações com cada um deles. Vamos ver um exemplo:

```twig
<ul id="categories-list">
    {% for category in store.categories %}
        <li id="li-cat-{{ category.slug }}">
            <a id="cat-{{ category.slug }}" href="{{ category.link }}">{{ category.name }}</a>
        </li>
    {% endfor %}
</ul>
```

Neste caso a variável `store.categories` é um vetor com outros elementos dentro
dele. Usando a tag `for` a gente passa por cada um destes elementos que agora
serão atribuidos a uma variável "temporária" chamada `category`. Dentro do `for`
então eu posso manipular estes elementos como qualquer outra variável, usando
inclusive filtros se necessário.

Este é seu funcionamento básico e já deve ser suficiente pra você realizar
tarefas complexas em seu template, mas a tag `for` é bem poderosa por isso vale
a pena estudar todas as suas possibilidades na documentação original
[aqui](http://twig.sensiolabs.org/doc/tags/for.html) (em inglês).

# Referência

Agora que você já conhece todos os principais elementos que podem constituir
seu template vamos tentar explicar mais à fundo exatamente quais são estes
elementos e seu funcionamento.

## Variáveis

Aqui você tem uma referência completa de todas as variáveis disponíveis para
manipulação em sua loja.

### store

Contém informações globais a respeito de sua loja.

***Disponível em todas as páginas.***

Variável | Descrição
---------|----------
store.name | O nome de sua loja.
store.logo | O endereço da imagem do logo de sua loja, se existente.
store.favicon.path | Endereço da imagem de seu favicon.
store.favicon.type | MIME Type da imagem de seu favicon. Útil na hora de incluí-lo em sua página.
store.description | Descrição completa de sua loja.
store.description_short | Descrição reduzida de sua loja.
store.url | O endereço completo de sua loja.
store.checkout_url | O endereço da página de carrinho/checkout de sua loja.
store.open_cart | Define se é possível ou não adicionar produtos ao carrinho de sua loja. Pode estar bloqueado no caso do modo de férias estar habilitado ou por razões internas do sistema.
store.notification | Texto de notificação. Geralmente definido quando o modo de férias está ativo.
store.ga | Código de rastreio do Google Analytics.
store.facebook_id | Id do usuário ou página do Facebook.
store.contact_info | Informações de contato da loja.
store.categories | Vetor contendo informações de todas as categorias da loja.
store.pages | Vetor contendo informações de todas as páginas de conteúdo da loja.

#### store.categories

Iterando pela variável `store.categories` você tem acesso a estas variáveis:

Variável | Descrição
---------|----------
category.id | Número de identificação da categoria. Único em toda a loja.
category.name | Nome da categoria.
category.slug | Slug da categoria, uma representação textual mais simples do nome da categoria.
category.link | Endereço que leva para a página desta categoria.
category.children | Array que abriga categorias filhas desta categoria. Reproduz a mesma estrutura de variáveis das categorias mães.

#### store.pages

Iterando pela variável `store.pages` você tem acesso a estas variáveis:

Variável | Descrição
---------|----------
page.id | Número de identificação da página. Único em toda a loja.
page.title | Título da página.
page.slug | Slug da página, uma representação textual mais simples do título da página.
page.link | Link para esta página em específico dentro da loja.
page.type | Tipo de página. Pode ser `internal` ou `external`. Se for `internal` designa uma página de conteúdo interno. Se for `external` designa um link externo. Apropriado para tratar com os links devem se comportar nas páginas.

## Filtros

...

## Funções

...

## Tags

...