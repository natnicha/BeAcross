import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# comparing module a to b -> is A transferable to B
# module A : 6 ects
# Module B : 7 ects 

def check_ects(ects_a, ects_b):
    if(abs(ects_a - ects_b)) > 1:
        return False
    else:
        return True

def check_level(level_a, level_b):

    level_a = level_a.lower()
    level_b = level_b.lower()

    print("bachelor" in level_b)

    if level_a == "" or level_b == "":
        return True
    elif "bachelor" in level_a and "bachelor" in level_b:
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

    # Compute TF-IDF vectors
    corpus = [text_a, text_b]
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(corpus)

    cosine_sim = cosine_similarity(tfidf_matrix[0], tfidf_matrix[1])
    print(cosine_sim)

#def check_program()
#def check_name()
def pre_process(text):
    text = text.lower()
    stopset = set(stopwords.words('english'))
    words = word_tokenize(text)
    words = [word.lower() for word in words if word.isalnum() and word.lower() not in stopset]
    return ' '.join(words)


