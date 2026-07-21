import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {IzdelieConfigService} from '../../../data/service/izdelie-config.service';
import {IzdelieConfigData} from '../../../data/model/izdelie-data.interface';
import {EventsService} from '../../../data/service/events.service';
import {CalculationPage} from '../calculation-page/calculation-page';

@Component({
  selector: 'app-body',
  imports: [
    CalculationPage
  ],
  templateUrl: './body.html',
  styleUrl: './body.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Body {
  private readonly izdelieConfigService = inject(IzdelieConfigService);
  private readonly eventsService = inject(EventsService);

  allIzdelies = signal<Array<{sectionId: string, izdelie: IzdelieConfigData}>>([]);

  selectedIzdelie = signal<IzdelieConfigData | null>(null);
  selectedSectionId = signal<string>('');

  constructor() {
    this.loadIzdelies();
  }

  private loadIzdelies(): void {
    this.izdelieConfigService.loadConfig().subscribe({
      next: (config) => {
        const items: Array<{sectionId: string, izdelie: IzdelieConfigData}> = [];

        config.sections.forEach(section => {
          section.izdelies.forEach(izdelie => {
            items.push({ sectionId: section.id, izdelie });
          });
        });

        this.allIzdelies.set(items);

        if (items.length > 0) {
          this.selectIzdelie(items[0].izdelie, items[0].sectionId);
        }
      },
      error: (error) => {
        console.error('Failed to load config:', error);
      }
    });
  }

  selectIzdelie(izdelie: IzdelieConfigData, sectionId: string): void {
    this.selectedSectionId.set(sectionId);
    this.selectedIzdelie.set(izdelie);

    this.eventsService.setCurrentIzdelie(izdelie);
  }
}
