import { Pipe, PipeTransform } from '@angular/core';
import { IPost } from '../interfaces/posts';

@Pipe({
  name: 'countComent',
  standalone: true
})
export class CountComentPipe implements PipeTransform {

  transform(post: IPost | undefined) {
    let totalLength = 0;

    if(!post){return totalLength}

    // Verifica se o nó atual tem o campo "children" e se é um array
    if (post.children && Array.isArray(post.children)) {
      // Soma o comprimento do array de "children"
      totalLength += post.children.length;
  
      // Para cada child, chama a função recursivamente
      for (let child of post.children) {
        if (typeof child === 'object' && child !== null) {
          totalLength += this.transform(child); // Soma o comprimento dos "children" internos
        }
      }
    }
  
    return totalLength;
  }

}
