import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, Optional } from '@angular/core';
import { EvoTabsService } from '../evo-tabs.service';
import { filter, takeUntil } from 'rxjs/operators';
import { EvoTabState } from '../evo-tab-state.collection';
import { NavigationEnd, Router, RouterLink, RouterLinkWithHref } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
    selector: 'evo-tab, [evoTab]',
    templateUrl: './evo-tab.component.html',
    styleUrls: ['./evo-tab.component.scss'],
})
export class EvoTabComponent implements OnInit, OnDestroy {

    @Input() name: string;

    selected = false;

    private _groupName: string;
    private destroy$ = new Subject<void>();

    constructor(
        private tabsService: EvoTabsService,
        private cd: ChangeDetectorRef,
        @Optional() private routerLink: RouterLink,
        @Optional() private routerLinkWithHref: RouterLinkWithHref,
        @Optional() private router: Router,
    ) {

    }

    set groupName(tabGroupId: string) {
        this._groupName = tabGroupId;
        this.subscribeToTabChanges();
    }

    get groupName(): string {
        return this._groupName;
    }

    ngOnInit() {
        this.subscribeOnNavigationEnd();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onChangeTabClick() {
        this.setTabActive();
    }

    private setTabActive() {
        this.tabsService.setTab(this.groupName, this.name);
    }

    private subscribeOnNavigationEnd() {
        this.router?.events.pipe(
            filter(event => event instanceof NavigationEnd),
            takeUntil(this.destroy$)
        ).subscribe(() => {
            const urlTree = this.routerLink?.urlTree || this.routerLinkWithHref?.urlTree;
            if (urlTree && this.router.isActive(urlTree, true)) {
                this.setTabActive();
            }
        });
    }

    private subscribeToTabChanges() {
        this.tabsService.getTabEventsSubscription(this.groupName, this.name).pipe(
            takeUntil(this.destroy$)
        ).subscribe((data: EvoTabState) => {
            this.selected = data.isActive;
            this.cd.detectChanges();
        });
    }
}
