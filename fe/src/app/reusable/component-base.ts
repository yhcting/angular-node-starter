import {
    Output,
    EventEmitter,
    OnDestroy
} from '@angular/core';
import {
    BehaviorSubject,
    Subject,
    Observable
} from 'rxjs';
import {
    filter,
    take,
    takeUntil
} from 'rxjs/operators';
import {
    Action,
    Store
} from '@ngrx/store';

/**
 * For private members '__'(double underbar) is used as suffix to avoid name conflict with
 *   inherited classes
 */
export class ComponentBase<S> implements OnDestroy {
    private sjs__: Subject<any>[] = [];
    private sjDestroy$__ = this.newSubject<void>();

    // EventEmiiter is NOT behavior subject.
    // @Output() doens't needed to be behaviorSubject.
    // But sometimes "inProgress$ | async" is used very early stage.
    // That is, observable of this event needed to be observable-of-behaivor-subject.
    @Output() inProgress = new EventEmitter<boolean>();
    __behaviorInProgress = this.newBehaviorSubject<boolean>(false);
    inProgress$ = this.__behaviorInProgress.asObservable();

    private progressCnt__ = 0;

    constructor(private readonly store__: Store<S>) {
    }

    ngOnDestroy() {
        this.sjDestroy$__.next();
        for (const sj of this.sjs__) { sj.complete(); }
    }

    //////////////////////////////////////////////////////////////////////////
    //
    //////////////////////////////////////////////////////////////////////////
    protected observe<K>(obs: Observable<K>): Observable<K> {
        return obs.pipe(takeUntil(this.sjDestroy$__));
    }

    protected obsget<K>(obs: Observable<K>): Observable<K> {
        return this.observe(obs).pipe(take(1));
    }

    protected selstore<K>(selector: (state: S) => K) {
        return this.observe(this.store__.select(selector));
    }

    protected getstore<K>(selector: (state: S) => K) {
        return this.observe(this.store__.select(selector)).pipe(take(1));
    }

    protected dispstore<V extends Action = Action>(action: V) {
        this.store__.dispatch(action);
    }

    protected newSubject<T>(): Subject<T> {
        const sj = new Subject<T>();
        this.sjs__.push(sj);
        return sj;
    }

    protected newBehaviorSubject<T>(v: T): BehaviorSubject<T> {
        const sj = new BehaviorSubject<T>(v);
        this.sjs__.push(sj);
        return sj;
    }

    //////////////////////////////////////////////////////////////////////////
    //
    //////////////////////////////////////////////////////////////////////////
    protected progressing(v: boolean) {
        if (v) {
            if (0 === this.progressCnt__) {
                this.__behaviorInProgress.next(true);
                this.inProgress.emit(true);
            }
            this.progressCnt__++;
        } else {
            if (1 === this.progressCnt__) {
                this.__behaviorInProgress.next(false);
                this.inProgress.emit(false);
            }
            console.assert(this.progressCnt__ > 0);
            this.progressCnt__--;
        }
    }
}
