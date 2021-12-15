import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { EvoColorKeys, EvoSizeKeys } from '../../common/types';

@Component({
    selector: 'evo-badge',
    templateUrl: './evo-badge.component.html',
    styleUrls: ['./evo-badge.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvoBadgeComponent {

    @Input() color: EvoColorKeys;
    @Input() size: EvoSizeKeys;
    @Input() multiline = false;

    // tslint:disable-next-line:no-input-rename
    @Input('width.px') widthPixels: number;
    // tslint:disable-next-line:no-input-rename
    @Input('width.%') widthPercents: number;

    get classes(): string[] {
        const classes: string[] = [];

        if (this.size) {
            classes.push(this.size);
        }

        if (this.color) {
            classes.push(this.color);
        }

        if (this.multiline) {
            classes.push('multiline');
        }

        return classes;
    }
}
