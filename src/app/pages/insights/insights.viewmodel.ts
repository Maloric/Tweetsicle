import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

// import { getTweets } from 'app/app.selectors';
import { AppState } from 'app/app.state';
import { TweetState } from 'app/services/twitter/reducer';

@Injectable()
export class InsightsViewModel {
    hashtags$: Observable<{ [key: string]: number }> = this.store.select('twitter')
        .map((x: TweetState) => {
            let keys = Object.keys(x.hashtags).sort((a, b) => x.hashtags[b] - x.hashtags[a]);
            let res = {};
            for (let i = 0; i < keys.length; i++) {
                if (x.query.split(' ').indexOf(keys[i]) > -1) {
                    continue;
                }
                res[keys[i]] = x.hashtags[keys[i]];
            }
            return res;
        })
        .publishReplay(1)
        .refCount();

    constructor(private store: Store<AppState>) { }
}