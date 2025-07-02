import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AppComponent } from "./app.component";
import { By } from "@angular/platform-browser";
import { AuthFacadeService } from "./core/facades/auth-facade.service";
import { MockAuthFacadeService } from "../testing/mocks/services/mock-auth-facade.service";

describe("AppComponent", () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let facade: MockAuthFacadeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [{ provide: AuthFacadeService, useClass: MockAuthFacadeService }],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    facade = TestBed.inject(AuthFacadeService) as unknown as MockAuthFacadeService;

    fixture.detectChanges();
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should expose the token signal from the facade", () => {
    facade.token.set("mock-token");
    expect(component.token()).toBe("mock-token");
  });

  it("should render the title in HTML", () => {
    const h2Elem: HTMLElement = fixture.debugElement.query(By.css("h2")).nativeElement;
    expect(h2Elem.textContent?.trim()).toBe(component.title);
  });

  it("should have title 'SFE Tech Task'", () => {
    expect(component.title).toBe("SFE Tech Task");
  });

  it("should not show logout link", () => {
    const anchorDebug = fixture.debugElement.query(By.css('[data-testid="logout"]'));
    expect(anchorDebug).toBeNull();
  });

  it("should show logout link", () => {
    facade.token.set("mock-token");
    fixture.detectChanges();
    const anchorDebug = fixture.debugElement.query(By.css('[data-testid="logout"]'));
    expect(anchorDebug).not.toBeNull();
  });

  it("should prevent default and call logout on click", () => {
    facade.token.set("mock-token");
    fixture.detectChanges();
    const anchorDebug = fixture.debugElement.query(By.css('[data-testid="logout"]'));
    const event = new MouseEvent("click");
    spyOn(event, "preventDefault");

    anchorDebug.triggerEventHandler("click", event);
    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect(facade.logout).toHaveBeenCalledTimes(1);
  });
});
