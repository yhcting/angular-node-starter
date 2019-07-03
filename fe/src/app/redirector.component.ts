import {
    Component,
    OnInit
} from '@angular/core';
import {
    ActivatedRoute,
    Router
} from '@angular/router';

export interface Query {
    url: string[];
    queryParams?: string;  // JSON.stringify(...)
}

/**
 * This is hacky component to mainly reload current url.
 * (Angular doens't support reload current url by router.navigate)
 * This is dirty and inefficient but fair enough and easy to use.
 */
@Component({
    // All bindings are made up of Observable. Therefore OnPush strategy is valid
    template: '',
})
export class RedirectorComponent implements OnInit {
    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router
    ) { }

    ngOnInit() {
        const q: Query = <Query>this.route.snapshot.queryParams;
        // console.log('Redirector', q);
        if (q.queryParams) {
            this.router.navigate(q.url, {
                queryParams: JSON.parse(q.queryParams)
            });
        } else {
            this.router.navigate(q.url);
        }
    }

}
