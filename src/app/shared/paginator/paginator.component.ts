import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnChanges {
  @Input() totalItems: number = 0;
  @Input() currentPage: number = 1;
  @Input() itemsPerPage: number = 20;
  @Input() itemsPerPageOptions: number[] = [10, 20, 50, 100];

  @Output() pageChange = new EventEmitter<number>();
  @Output() itemsPerPageChange = new EventEmitter<number>();

  get totalPaginas(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get paginasVisibles(): number[] {
    const total = this.totalPaginas;
    const actual = this.currentPage;
    const maxVisible = 5;

    if (total <= maxVisible) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const mitad = Math.floor(maxVisible / 2);
    let inicio = actual - mitad;
    let fin = actual + mitad;

    if (inicio < 1) {
      inicio = 1;
      fin = maxVisible;
    }

    if (fin > total) {
      fin = total;
      inicio = total - maxVisible + 1;
    }

    return Array.from({ length: fin - inicio + 1 }, (_, i) => inicio + i);
  }

  get mostrarEllipsisInicio(): boolean {
    return this.paginasVisibles.length > 0 && this.paginasVisibles[0] > 1;
  }

  get mostrarEllipsisFin(): boolean {
    return this.paginasVisibles.length > 0 &&
           this.paginasVisibles[this.paginasVisibles.length - 1] < this.totalPaginas;
  }

  get rangoInicio(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  get rangoFin(): number {
    const fin = this.currentPage * this.itemsPerPage;
    return fin > this.totalItems ? this.totalItems : fin;
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Si cambian los items por página, resetear a página 1
    if (changes['itemsPerPage'] && !changes['itemsPerPage'].firstChange) {
      this.cambiarPagina(1);
    }

    // Si la página actual excede el total de páginas, ajustar
    if (this.currentPage > this.totalPaginas && this.totalPaginas > 0) {
      this.cambiarPagina(this.totalPaginas);
    }
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas && pagina !== this.currentPage) {
      this.pageChange.emit(pagina);
    }
  }

  cambiarItemsPorPagina(items: number): void {
    if (items !== this.itemsPerPage) {
      this.itemsPerPageChange.emit(items);
    }
  }
}
