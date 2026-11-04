// Chuyển chuỗi/obj JSON thông số kỹ thuật thành mảng [{ key, value }] để lưu ProductDescription.
const parseSpecifications = (input) => {
    if (input == null || input === '') return [];

    const specifications = typeof input === 'string' ? JSON.parse(input) : input;
    if (!specifications || typeof specifications !== 'object' || Array.isArray(specifications)) {
        throw new Error('Thông số kỹ thuật phải là một object JSON');
    }

    return Object.entries(specifications).map(([key, value]) => ({
        key: key.trim(),
        value: String(value ?? '')
    })).filter(specification => specification.key);
};

module.exports = { parseSpecifications };
