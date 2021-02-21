export const parseJSONFormat = (data) => {
  const contents = data.json?.content || [];
  let description = [];
  contents.forEach(content => {
    if (content.nodeType === 'paragraph') {
      if (content.content[0].value) {
        description.push({
          type: 'paragraph',
          content: content.content[0].value
        });
      }
    } else if (content.nodeType === 'hr') {
      description.push({
        type: 'hr'
      });
    } else if (content.nodeType === 'unordered-list') {
      const listContents = content.content || [];
      let listData = {
        type: 'list',
        content: []
      };
      listContents.forEach(listContent => {
        if (listContent.nodeType === 'list-item') {
          listData.content.push(listContent.content[0].content[0].value);
        }
      });
      description.push(listData);
    }
  });
  return description;
}

export const parsedJSON2Html = (data) => {

  console.log('ParsedJson2Html:', data);
  let htmlString = '';
  for (let i = 0; i < data.length; i++) {
    if (data[i].type === 'paragraph') {
      htmlString += '<p>' + data[i].content + '</p>';
    }
  }
  return htmlString;
}