from sklearn.feature_extraction.text import CountVectorizer
import pandas as pd
import nagisa

pd.set_option("display.max_columns", 10)

texts = [
    "フライパンにサラダ油を入れて弱火で熱し、鶏肉の皮側を下にして入れる。", # x
    "ねぎ、生姜はみじん切りにしてボウルに入れる。",     # y0
    "鶏肉は身の厚い部分は浅く切り込みを入れる。",       # y1
    "ビニール袋になす、鶏肉、片栗粉を入れる",          # y2
    "フライパンにごま油を入れて熱し、鶏肉を入れる。",   # y3
    "中火で全体がこんがりと焼けたらナスを加える"        #y4
]

stop_words=['、','。','が','し','て','で','と','に','の']
    
def tokenize(doc):
    doc = nagisa.tagging(doc)
    print(doc)
    return doc.words

    
vectorizer = CountVectorizer(tokenizer=tokenize,stop_words=stop_words)
matrix = vectorizer.fit_transform(texts)

df = pd.DataFrame(matrix.toarray(),
                        columns=vectorizer.get_feature_names())

print(df)
print(vectorizer.get_feature_names())