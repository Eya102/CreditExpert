import { Component } from '@angular/core';
import { Directive, ElementRef, HostListener, Input } from '@angular/core';


@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.css']
})
export class BusinessComponent {
  @Input() questions:Array<{ question: string, answer: string }> = [];
   activeQuestion: number = 0;
   answering: boolean = true;

  constructor(private elementRef: ElementRef) {
    this.questions = [
      { question: "What's your name?", answer: "" },
      { question: "How old are you?", answer: "" },
      { question: "Where do you live?", answer: "" }
    ];

    this.open(0);

    setTimeout(() => {
      this.open(this.activeQuestion + 1);
    }, 2000);
  }

   removeOpen() {
    const questionElements = this.elementRef.nativeElement.querySelectorAll('.question');
    questionElements.forEach((questionElement: Element) => {
      questionElement.classList.remove('open');
    });
  }

   scrollToAndFocus(element: Element, to: number, duration: number, focus: number) {
    if (duration <= 10) {
      this.setFocus(focus);
      return;
    }
    const difference = to - element.scrollTop;
    const perTick = difference / duration * 10;
    setTimeout(() => {
      element.scrollTop = element.scrollTop + perTick;
      if (element.scrollTop === to) return;
      this.scrollToAndFocus(element, to, duration - 10, focus);
    }, 10);
  }

   setFocus(questionIndex: number) {
    const questionId = 'q' + questionIndex;
    const questionElement = this.elementRef.nativeElement.querySelector(`#${questionId}`);
    if (questionElement) {
      questionElement.focus();
    }
  }

  @HostListener('keydown', ['$event'])
   handleKeydown(event: KeyboardEvent) {
    event.preventDefault();
    switch (event.key) {
      case 'ArrowLeft':
        this.open(this.activeQuestion - 1);
        break;
      case 'ArrowRight':
      case 'Enter':
      case 'Tab':
        this.open(this.activeQuestion + 1);
        break;
    }
  }

   open(order: number) {
    this.removeOpen();
    if (order >= this.questions.length || order < 0) {
      this.answering = false;
      this.elementRef.nativeElement.classList.remove('answering');
      this.activeQuestion = this.questions.length + 1;
    } else {
      this.answering = true;
      this.elementRef.nativeElement.classList.add('answering');
      this.activeQuestion = order;
      let offset = 0;
      if (order !== 0) {
        const questionElements = this.elementRef.nativeElement.querySelectorAll('.question');
        offset = questionElements[order - 1].getBoundingClientRect().top;
      }
      this.scrollToAndFocus(this.elementRef.nativeElement, offset, 500, order);
      const questionElement = this.elementRef.nativeElement.querySelector(`#q${order}`);
      if (questionElement) {
        questionElement.classList.add('open');
      }
    }
  }

}
