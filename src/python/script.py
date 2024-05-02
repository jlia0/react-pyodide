import js

def do_work(*args):
        import snowballstemmer
        stemmer = snowballstemmer.stemmer('english')
        print(js.data.textdata)
        txt = js.data.textdata
        newval = stemmer.stemWords(txt.split())
        return newval
import micropip
micropip.install('snowballstemmer').then(do_work)

