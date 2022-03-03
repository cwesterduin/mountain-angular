import { ComponentFixture, TestBed } from '@angular/core/testing';

import { S3ImageComponent } from './s3-image.component';

describe('S3ImageComponent', () => {
  let component: S3ImageComponent;
  let fixture: ComponentFixture<S3ImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ S3ImageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(S3ImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
