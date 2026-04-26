export function polynomial_regression(x: number[], y: number[], degree: 2 | 3 | 4 = 3): number[] {
  const n = x.length
  const m = degree + 1

  const X = buildVandermonde(x, m)

  // Perform QR decomposition
  const { Q, R } = qrDecomposition(X, n, m)

  // Compute Q^T * y
  const QTy = matrixVectorMultiply(Q, y, n, m, true)

  // Solve R * β = Q^T y using back substitution
  const coefficients = backSubstitution(R, QTy, m)

  return coefficients
}

export function discretize(x_min: number, x_max: number, coef: number[]): { x: number[]; y: number[] } {
  const x: number[] = Array.from({ length: x_max - x_min + 1 }, (_, i) => x_min + i)
  const y: number[] = x.map((val) => {
    return coef.reduce((sum, coeff, i) => sum + coeff * Math.pow(val, i), 0)
  })

  return { x, y }
}

export function find_maximum_distance_point(x: number[], y: number[]): { x: number; y: number } {
  const n = x.length
  let maxDistance = -Infinity
  let maxPoint = { x: 0, y: 0 }

  for (let i = 0; i < n; i++) {
    const distance = Math.sqrt(x[i] * x[i] + y[i] * y[i])
    if (distance > maxDistance) {
      maxDistance = distance
      maxPoint = { x: x[i], y: y[i] }
    }
  }

  return maxPoint
}

function buildVandermonde(x: number[], m: number): number[][] {
  const n = x.length
  const V: number[][] = Array.from({ length: n })

  for (let i = 0; i < n; i++) {
    V[i] = Array.from({ length: m })
    let power = 1
    for (let j = 0; j < m; j++) {
      V[i][j] = power
      power *= x[i]
    }
  }

  return V
}

function qrDecomposition(
  A: number[][],
  rows: number,
  cols: number,
): { Q: number[][]; R: number[][] } {
  // Initialize Q as identity matrix
  const Q: number[][] = new Array(rows)
  for (let i = 0; i < rows; i++) {
    Q[i] = new Array(cols)
    for (let j = 0; j < cols; j++) {
      Q[i][j] = i === j ? 1 : 0
    }
  }

  // Copy A to R
  const R: number[][] = new Array(cols)
  for (let i = 0; i < cols; i++) {
    R[i] = new Array(cols)
    for (let j = 0; j < cols; j++) {
      R[i][j] = A[i]?.[j] || 0
    }
  }

  // Gram-Schmidt process
  for (let i = 0; i < cols; i++) {
    // Get column i from original matrix
    const column: number[] = new Array(rows)
    for (let k = 0; k < rows; k++) {
      column[k] = A[k][i]
    }

    // Subtract projections onto previous columns
    for (let j = 0; j < i; j++) {
      let dot = 0
      for (let k = 0; k < rows; k++) {
        dot += column[k] * Q[k][j]
      }
      R[j][i] = dot

      for (let k = 0; k < rows; k++) {
        column[k] -= dot * Q[k][j]
      }
    }

    // Normalize column
    let norm = 0
    for (let k = 0; k < rows; k++) {
      norm += column[k] * column[k]
    }
    norm = Math.sqrt(norm)

    if (norm < 1e-10) {
      throw new Error('Matrix is rank deficient')
    }

    R[i][i] = norm
    for (let k = 0; k < rows; k++) {
      Q[k][i] = column[k] / norm
    }
  }

  return { Q, R }
}

function matrixVectorMultiply(
  matrix: number[][],
  vector: number[],
  rows: number,
  cols: number,
  transpose: boolean = false,
): number[] {
  const result: number[] = new Array(transpose ? cols : rows)

  if (transpose) {
    // Q^T * y
    for (let i = 0; i < cols; i++) {
      let sum = 0
      for (let j = 0; j < rows; j++) {
        sum += matrix[j][i] * vector[j]
      }
      result[i] = sum
    }
  } else {
    // Q * y
    for (let i = 0; i < rows; i++) {
      let sum = 0
      for (let j = 0; j < cols; j++) {
        sum += matrix[i][j] * vector[j]
      }
      result[i] = sum
    }
  }

  return result
}

function backSubstitution(R: number[][], b: number[], n: number): number[] {
  const x: number[] = new Array(n)

  for (let i = n - 1; i >= 0; i--) {
    let sum = b[i]
    for (let j = i + 1; j < n; j++) {
      sum -= R[i][j] * x[j]
    }
    x[i] = sum / R[i][i]
  }

  return x
}
