import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {Router} from "@angular/router";

interface IKeywords {
    category: string[],
    searchWord: string[]
}

@Injectable({
    providedIn: 'root'
})
export class SearchService {

    keywords: IKeywords;

    valueChangesSubject = new BehaviorSubject<IKeywords>({category: [], searchWord: []});
    valueChanges$ = this.valueChangesSubject.asObservable();

    submitSubject = new Subject<string>();
    submit$ = this.submitSubject.asObservable();

    isOpenSubject = new BehaviorSubject<boolean>(false);
    isOpen$ = this.isOpenSubject.asObservable();

    constructor(private router: Router) {
    }


    onSearch(terms) {
        if (!terms){
            return
        }

        //TODO fix search terms
        console.log("search terms:", terms)
        const additionalKeys = terms.split(' ');
        additionalKeys.filter(e => String(e).trim());
        if (!additionalKeys.includes('')) {
            this.valueChangesSubject.value.searchWord.push(...additionalKeys)
            // this.keywords.searchWord.push(additionalKeys);
        }
        // this.keywords.searchWord = this.keywords.searchWord.filter((v, i) => this.keywords.searchWord.indexOf(v) === i);
        // this.valueChangesSubject.next(this.keywords)
        this.updateRoute();
    }

    //TODO fix adding categories
    onSelectCategory(categories) {
        console.log(categories)
        const values = [];
        for (let v of categories) {
            values.push(v.value);
        }
        // this.keywords.category.includes(category) ? this.onDeselectCategory(category) : this.keywords.category.push(category);
        this.valueChangesSubject.value.category = values;
        this.updateRoute();
    }

    onDeselectCategory(category) {
        this.keywords.category.splice(this.keywords.category.indexOf(category), 1);
        this.updateRoute();
    }

    removeKey(key) {
        this.keywords.searchWord.splice(this.keywords.searchWord.indexOf(key), 1);
        this.updateRoute();
    }

    updateRoute() {
        this.valueChanges$.subscribe(params => {
            if ((params.searchWord.length > 0) || (params.category.length > 0)){
                this.router.navigate(
                    ['results'],
                    {
                        queryParams: {search: params.searchWord, category: params.category}
                    });
            }
        })

    }


}
