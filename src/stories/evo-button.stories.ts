import { storiesOf, moduleMetadata } from '@storybook/angular';
import { EvoUiKitModule } from '../../node_modules/evo-ui-kit';

storiesOf('Components/EvoButton', module)
  .addDecorator(
    moduleMetadata({
      imports: [EvoUiKitModule],
    })
  )
  .add('default', () => ({
    template: '<evo-button>Click me</evo-button>'
  }))
  .add('with size', () => ({
    template: `
    <div *ngFor="let size of sizes;">
      <p><evo-button [size]="size">Click me</evo-button></p>
    </div>
    `,
    props: {
      sizes: [
        'small',
        'large',
        'full-width',
      ]
    }
  }))
  .add('with color', () => ({
    template: `
    <div *ngFor="let color of colors;">
      <p><evo-button [color]="color">Click me</evo-button></p>
    </div>
    `,
    props: {
      colors: [
        'lined',
        'darkblue',
        'darkblue-lined',
        'green',
        'green-lined',
        'purple',
      ]
    }
  }))
  .add('with state', () => ({
    template: `
    <p><evo-button [disabled]="true">Click me</evo-button></p>
    <p><evo-button [loading]="true">Click me</evo-button></p>
    `
  }));
