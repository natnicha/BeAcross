import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from unidecode import unidecode
from nltk.stem import WordNetLemmatizer

### Get data and run model

# comparing module a to b -> is A transferable to B
# module A : 6 ects
# Module B : 7 ects

def check_ects(ects_a, ects_b):

    if(ects_a - ects_b) > 1:
        return False
    else:
        return True


def check_level(level_a, level_b):

    if level_a is None or level_b is None:
        return True

    if level_a == "" or level_b == "":
        return True
    level_a = level_a.lower()
    level_b = level_b.lower()
    if "bachelor" in level_a and "bachelor" in level_b:
        print("Both courses are bachelors")
        return True
    elif "master" in level_a and "master" in level_b:
        print("Both courses are masters")
        return True
    else:
        return False


def check_content(text_a, text_b):
    text_a = pre_process(text_a)
    text_b = pre_process(text_b)

    text_a = lemma(text_a)
    text_b = lemma(text_b)
    print(text_a)
    print(text_b)
    corpus = [text_a, text_b]
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(corpus)

    cosine_sim = cosine_similarity(tfidf_matrix[0], tfidf_matrix[1])
    return cosine_sim

def compare_titles(name_a, name_b):
    text1 = name_a.lower()
    text2 = name_b.lower()

    text1 = lemma(text1)
    text2 = lemma(text2)

    corpus = [text1, text2]
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(corpus)

    cosine_sim = cosine_similarity(tfidf_matrix[0], tfidf_matrix[1])
    return cosine_sim


def pre_process(text):
    text = text.lower()
    text = unidecode(text)
    stopset = set(stopwords.words('english'))
    words = word_tokenize(text)
    words = [word.lower() for word in words if word.isalnum() and word.lower() not in stopset]
    return ' '.join(words)

def lemma(text):
    lemmatizer = WordNetLemmatizer()
    words = word_tokenize(text)
    lemmatized_string = ' '.join([lemmatizer.lemmatize(words) for words in words])
    return lemmatized_string