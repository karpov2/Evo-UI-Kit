import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { EvoControlStates } from '../../common/evo-control-state-manager/evo-control-states.enum';
import { EvoBaseControl } from '../../common/evo-base-control';

@Component({
  selector: 'evo-input',
  templateUrl: './evo-input.component.html',
  styleUrls: [ './evo-input.component.scss' ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EvoInputComponent),
      multi: true,
    },
  ],
})
export class EvoInputComponent extends EvoBaseControl implements ControlValueAccessor, AfterViewInit {
  @Input() autoFocus: boolean;
  @Input() mask: any;
  @Input() placeholder: string;
  @Input() tooltip: string;
  @Input() type = 'text';
  @Input('value') _value: string;

  @Output() blur: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('input') inputElement;
  @ViewChild('tooltipContainer') tooltipElement;

  customTooltipChecked = false;
  hasCustomTooltip = false;
  tooltipShown = false;
  disabled = false;
  focused = false;
  private tooltipVisibilityTimeout = false;

  constructor(private changeDetector: ChangeDetectorRef) {
    super();
  }

  onChange = (value) => {};
  onTouched = () => {};

  ngAfterViewInit() {
    if (this.autoFocus) {
      this.inputElement.nativeElement.focus();
    }

    this.checkCustomTooltip();
  }

  get value(): any {
    return this._value;
  }

  set value(value: any) {
    if (value || this._value) {
      this._value = value;
      this.onChange(value);
    }
  }

  get inputClass(): {[cssClass: string]: boolean} {
    return {
      'focused': this.focused,
      'disabled': this.disabled,
      'valid': this.currentState[EvoControlStates.valid],
      'invalid': this.currentState[EvoControlStates.invalid],
    };
  }

  get hasAdditional(): boolean {
    return !!this.tooltip || this.hasCustomTooltip;
  }

  writeValue(value: any): void {
    if (value !== this._value) {
      this.value = value;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(state: boolean): void {
    this.disabled = state;
  }

  onFocus(): void {
    if (!this.focused) {
      this.focused = true;
    }
  }

  onBlur(): void {
    this.focused = false;
    this.onTouched();
    this.blur.emit();
  }

  onTooltipClick(event: any): void {
    event.preventDefault();
    event.stopPropagation();
  }

  hideTooltip() {
    this.tooltipVisibilityTimeout = true;

    setTimeout(() => {
      if (this.tooltipVisibilityTimeout) {
        this.tooltipShown = false;
      }
    }, 25);
  }

  showTooltip() {
    this.tooltipShown = true;
    this.tooltipVisibilityTimeout = false;
  }

  private checkCustomTooltip() {
    this.hasCustomTooltip = this.tooltipElement &&
                this.tooltipElement.nativeElement &&
                this.tooltipElement.nativeElement.children.length > 0;
    this.changeDetector.detectChanges();
    this.customTooltipChecked = true;
  }
}
