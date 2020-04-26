---
title: Eliza(2001年)
category: "アーカイブ"

cover: eliza.png
author: 加藤真一
---
チャットボットを語る上で外せない存在であるイライザ(Eliza)は1966年にMITのJ. Weizenbaumによって開発されました[^1]。
このプログラムはセラピストとしてユーザと対談することで知られており、当時会話の相手の人間っぽさを競うチューリングテストを行えば、Elizaはコンピュータだとは見破られないのではないかと言われていました。現在ではそのソースはさまざまなプラットホーム用に移植されており，Java版[Eliza Test](http://chayden.net/eliza/Eliza.html)、python版[eliza.py](https://github.com/jezhiggins/eliza.py)、Perl5版[Chatbot::Eliza](https://metacpan.org/pod/Chatbot::Eliza)など、数多くの実装が公開されています。また[ブラウザ上で動作するデモ](http://psych.fullerton.edu/mbirnbaum/psych101/Eliza.htm)も数多くありますので、ぜひ話しかけてみてください。今回はこの、最初期にして最高のチャットボットと言われるElizaのソースコードを見ながら多くの人を驚かせたメカニズムに触れてみましょう。  

Elizaのソースはコードとスクリプトに分かれています。このうちスクリプトに注目すれば何をしようとしているのかを読み取れそうです。スクリプトを見てみると、会話機能の中核部分はキー`key`、分解`decomp`と再構成`reasmb`からなっています。「傾聴」をご存知の方であれば、この部分を見ただけでもおおむね想像がつくかもしれません。

```yaml
key: remember 5
  decomp: * i remember *
    reasmb: Do you often think of (2) ?
    reasmb: Does thinking of (2) bring anything else to mind ?
    reasmb: What else do you recollect ?
    reasmb: Why do you remember (2) just now ?
    reasmb: What in the present situation reminds you of (2) ?
    reasmb: What is the connection between me and (2) ?
    reasmb: What else does (2) remind you of ?
```
Elizaはユーザの入力の中にキーである`remember`という単語を発見した場合、`decomp`の `* i remember *` というパターンにマッチするかどうかを検査します。このとき`*` は順番にその後の`(1)`や`(2)`に展開されます。正規表現の( )演算子と同様の働きです。そして、パターンにマッチするたびに`reasmb`に並んだ候補を前から順に一つ選択してユーザに返しています。最初の返事では「(2)について考えているんですか？」という返事ですが、後半では「*他に*思いつくことはありませんか？」のように、二回目以降だと自然な言い回しが使われているのがわかると思います。重要なポイントは**積極的にユーザの発言をとり入れて返事に組み込んでいる**点で、それによってユーザはElizaがちゃんとこちらの言うことを聞いているような感覚を得ることができます。なお、rememberの最後の5という数字は優先度です。そして、話題があまり望まない方向に進みそうな単語を見つけると

```yaml
key: name 15
  decomp: *
    reasmb: I am not interested in names.
    reasmb: I've told you before, I don't care about names -- please continue.
```

Elizaは*やんわりと軌道修正をしようとします*。また疑問文を多用する傾向があり、ユーザに考えさせようとする点が特徴になっています。ユーザの感情表現に対して返すリアクションは充実しており、

```yaml
key: i 0
  decomp: * i @desire *
    reasmb: What would it mean to you if you got (3) ?
    reasmb: Why do you want (3) ?
    reasmb: Suppose you got (3) soon.
    reasmb: What if you never got (3) ?
    reasmb: What would getting (3) mean to you ?
    reasmb: What does wanting (3) have to do with this discussion ?
  decomp: * i am* @sad *
    reasmb: I am sorry to hear that you are (3).
    reasmb: Do you think coming here will help you not to be (3) ?
    reasmb: I'm sure it's not pleasant to be (3).
    reasmb: Can you explain what made you (3) ?
  decomp: * i am* @happy *
    reasmb: How have I helped you to be (3) ?
    reasmb: Has your treatment made you (3) ?
    reasmb: What makes you (3) just now ?
    reasmb: Can you explain why you are suddenly (3) ?
```

希望があればその理由を聞いたり、「もうすぐ叶うと思いますよ」と励ましたりしています。悲しい気持ちやハッピーな気持ちに対しては共感を示し、さらに詳しく聞く興味を示しています。このように注意深くデザインされたキャラクタは心理療法家というElizaの職業的役割から導かれています。  

これまで見てきたようにElizaはかなりの質問好きなのですが、ユーザがそれに答えた場合はどうしているのでしょうか？  

```yaml
key: because 0
  decomp: *
    reasmb: Is that the real reason ?
    reasmb: Don't any other reasons come to mind ?
    reasmb: Does that reason seem to explain anything else ?
    reasmb: What other reasons might there be ?
```

答えてもらった内容について良いとも悪いとも特にコメントせず、さらに質問で返しています。チャットボット的にも上手い返し方だと思いますが、相手の答えの評価をしないというふるまいは心理カウンセラーの基本的なルールに沿ったものになっています。 

さらに興味深い仕掛けとしてElizaには`reasm_for_memory`という指令があります。この指令ではユーザの返事の一部を用いて生成した返事をその場では使わず、メモリに格納しておきます。そして通常の返事ができなくなった場合に格納しておいて返事を持ち出してきて「思い出した」的に話題の転換、もしくは継続を図ろうとします。これはなかなか巧妙で、ユーザは**これまでの会話の内容をチャットボットが覚えていてくれた**、つまりチャットボットが自分に対して興味を持ってくれているという重要な感覚を得ることができるのです。

```yaml
key: my 2
  decomp: * my *
    reasm_for_memory: Let's discuss further why your (2).
    reasm_for_memory: Earlier you said your (2).
    reasm_for_memory: But your (2).
    reasm_for_memory: Does that have anything to do
                      with the fact that your (2) ?
```



## Elizaの教え

　Elizaのスクリプトは合計でわずか460行ほどです。その中で

* ユーザの発言に対する質問を主に行う
* 自分のことに注意を向けさせないように話題を誘導する
* 質問に対するユーザの返答を評価しない 
* ユーザの語ったことを記憶し、後で思い出した風に利用する

という挙動に注力した作りになっています。  
日本語での雑談では I desire ... とか I am so happy because ... にあたるような直截な物言いはなかなかしないかもしれません。また英語は語順が比較的固定されているのでこのようなパターンマッチングに適していますが、日本語では文節の順番を入れ替えても意味が変わらないような場合も多く、同様の機構を作ろうとするとかなり文法的に複雑なものになってしまうでしょう。その一方で**注意深く設計された対話**の威力が大きいことも感じられたのではないでしょうか。



[^1]: J. Weizenbaum, ["ELIZA--A Computer Program For the Study of Natural Language Communication Between Man and Machine"](https://www.csee.umbc.edu/courses/331/papers/eliza.html), Commun. ACM 9[1] 36-45(1966)