import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetrieveChartComponent } from './retrieve-chart.component';

describe('RetrieveChartComponent', () => {
  let component: RetrieveChartComponent;
  let fixture: ComponentFixture<RetrieveChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RetrieveChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
