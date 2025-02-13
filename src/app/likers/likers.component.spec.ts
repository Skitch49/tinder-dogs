import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LikersComponent } from './likers.component';

describe('LikersComponent', () => {
  let component: LikersComponent;
  let fixture: ComponentFixture<LikersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LikersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LikersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
