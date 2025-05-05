import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchPsychologistPage } from './search-psychologist.page';

describe('SearchPsychologistPage', () => {
  let component: SearchPsychologistPage;
  let fixture: ComponentFixture<SearchPsychologistPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchPsychologistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
