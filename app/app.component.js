"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var common_1 = require('@angular/common');
var router_deprecated_1 = require('@angular/router-deprecated');
var http_1 = require('@angular/http');
require('rxjs/add/operator/map');
require('rxjs/add/operator/toPromise');
var MyInput = (function () {
    function MyInput(renderer, elementRef) {
        this.renderer = renderer;
        this.elementRef = elementRef;
    }
    MyInput.prototype.ngOnInit = function () {
        this.renderer.invokeElementMethod(this.elementRef.nativeElement, 'focus', []);
    };
    MyInput = __decorate([
        core_1.Directive({
            selector: 'input[type=text]'
        }), 
        __metadata('design:paramtypes', [core_1.Renderer, core_1.ElementRef])
    ], MyInput);
    return MyInput;
}());
//============================================================================
var TodoService = (function () {
    function TodoService(_http) {
        this._http = _http;
    }
    TodoService.prototype.getTodoList = function () {
        var _this = this;
        var aPromise = this._http.get("/items.json")
            .map(function (response) { return response.json().data; })
            .toPromise();
        aPromise.then(function (tasksFromServer) { return _this.todolist = tasksFromServer; });
    };
    TodoService.prototype.addItem = function (item) {
        this.todolist.push(item);
    };
    TodoService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], TodoService);
    return TodoService;
}());
exports.TodoService = TodoService;
//=========================================================
var TodoNewComponent = (function () {
    function TodoNewComponent(todoSrvc) {
        this.todoSrvc = todoSrvc;
        this.eventEmitterDoubleClick = new core_1.EventEmitter();
        this.item = { title: "", completed: false };
    }
    TodoNewComponent.prototype.onRemove = function (item, headcbb) {
        this.todoSrvc.todolist.splice(this.todoSrvc.todolist.indexOf(item), 1);
        item.isEditing = false;
        if (this.todoSrvc.todolist.length == 0) {
            headcbb.checked = false;
        }
    };
    TodoNewComponent.prototype.onEditSubmit = function (item, event) {
        console.log(" - " + event.keyCode);
        if ((event.type == "click") || event.keyCode == 13 || event.type == "blur") {
            var temp3 = String(item.title);
            if (temp3.length == 0) {
                this.todoSrvc.todolist.splice(this.todoSrvc.todolist.indexOf(item), 1);
            }
            item.title = temp3.trim();
            item.isEditing = false;
        }
        else if (event.keyCode == 27) {
            item.isEditing = false;
            item.title = this.oldItemTitleValue;
        }
    };
    TodoNewComponent.prototype.eventEmitDoubleClick = function (item, event) {
        //console.log("in the comp");
        this.eventEmitterDoubleClick.emit(event);
        this.oldItemTitleValue = item.title;
        if (!item.completed) {
            item.isEditing = true;
        }
    };
    TodoNewComponent.prototype.ngOnInit = function () {
        this.todoSrvc.getTodoList();
    };
    TodoNewComponent.prototype.onCreateSubmit = function (item, event, headcbb) {
        var temp3 = String(item.title);
        var temp4 = temp3.trim();
        console.log(item + " - " + event.type + " - " + event.keyCode + " - " + event.target + " - " + event.currentTarget.id + " - " + event.target + " - " + temp4.length);
        if ((event.type == "click") || event.keyCode == 13) {
            console.log(temp4 == null || temp4.length == 0);
            if (temp4 == null || temp4.length == 0) {
                alert("Please enter item description.. ");
            }
            else {
                item.title = temp4;
                item.id = String(Math.floor((Math.random() * 1000) + 1));
                this.todoSrvc.addItem(item);
                this.item = { title: "", completed: false };
                if (this.todoSrvc.todolist.length == 0) {
                    headcbb.checked = false;
                }
            }
        }
    };
    TodoNewComponent.prototype.toggleMain = function (event, item) {
        var isChecked = event.currentTarget.checked;
        var i;
        var lst = this.todoSrvc.todolist;
        for (i = 0; i < lst.length; i++) {
            var k = lst[i];
            k.completed = isChecked;
            k.selected = isChecked;
        }
    };
    TodoNewComponent.prototype.toggleIndividual = function (event, item, headcbb) {
        console.log(item + " - " + event.type + " - " + event.keyCode + " - " + event.target + " - " + event.currentTarget.id + " - " + event.target + " - " + event.currentTarget.checked);
        var chkboxvalue = event.currentTarget.checked;
        if (event.type == "mouseover") {
            chkboxvalue = true;
            item.completed = true;
            item.selected = true;
        }
        if (chkboxvalue) {
            item.isEditing = false;
            item.completed = chkboxvalue;
            var lst = this.todoSrvc.todolist;
            var i;
            var toggle = false;
            for (i = 0; i < lst.length; i++) {
                var temp = lst[i].id != event.currentTarget.id;
                if (temp) {
                    var tmp = lst[i].selected;
                    if (tmp) {
                        toggle = true;
                    }
                    else {
                        toggle = false;
                        break;
                    }
                    var k = lst[i];
                    k.completed = chkboxvalue;
                    k.selected = chkboxvalue;
                }
            }
            if (toggle) {
                headcbb.checked = true;
            }
        }
        else {
            item.completed = chkboxvalue;
            headcbb.checked = chkboxvalue;
        }
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], TodoNewComponent.prototype, "eventEmitterDoubleClick", void 0);
    TodoNewComponent = __decorate([
        core_1.Component({
            selector: 'todocomp-new',
            directives: [router_deprecated_1.ROUTER_DIRECTIVES, MyInput, common_1.CORE_DIRECTIVES, common_1.FORM_DIRECTIVES],
            providers: [router_deprecated_1.ROUTER_PROVIDERS],
            templateUrl: 'app/todo.html'
        }), 
        __metadata('design:paramtypes', [TodoService])
    ], TodoNewComponent);
    return TodoNewComponent;
}());
exports.TodoNewComponent = TodoNewComponent;
//=========================================================
var TodoComponent = (function () {
    function TodoComponent(todoSrvc) {
        this.todoSrvc = todoSrvc;
    }
    TodoComponent.prototype.ngOnInit = function () {
        this.todoSrvc.getTodoList();
    };
    TodoComponent.prototype.completeTask = function (item) {
        item.completed = true;
    };
    TodoComponent = __decorate([
        core_1.Component({
            selector: 'todocomp',
            directives: [router_deprecated_1.ROUTER_DIRECTIVES],
            providers: [router_deprecated_1.ROUTER_PROVIDERS],
            template: '<h4>TODO List</h4>\
    <ul>\
       <li *ngFor="let item of todoSrvc.todolist">\
           <span [class.completed]="item.completed">{{ item.title }}-{{item.completed}}</span>\
           <button (click)="completeTask(item)">Click to complete</button>\
       </li>\
    </ul>',
            styles: [".completed {color:green}"]
        }), 
        __metadata('design:paramtypes', [TodoService])
    ], TodoComponent);
    return TodoComponent;
}());
exports.TodoComponent = TodoComponent;
//=========================================================
var AppComponent = (function () {
    function AppComponent() {
    }
    AppComponent.prototype.ngOnInit = function () { };
    AppComponent.prototype.receiveEvent = function (event) {
        //  console.log('DoubleClick event from ');
        //console.log(event);
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'rbi-app',
            directives: [TodoNewComponent, TodoComponent, router_deprecated_1.ROUTER_DIRECTIVES],
            providers: [router_deprecated_1.ROUTER_PROVIDERS, TodoService],
            template: '<div class="container"><h4><strong>TODO List Application</strong></h4>\
                          <todocomp-new (eventEmitterDoubleClick)="receiveEvent($event)"></todocomp-new>\
                      </div>'
        }), 
        __metadata('design:paramtypes', [])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map